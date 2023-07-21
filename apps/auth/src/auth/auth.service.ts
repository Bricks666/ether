import {
	ForbiddenException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from '@/users';
import { TOKEN_SECRET } from '@/shared';
import type {
	AuthResponseDto,
	LoginDto,
	RegistrationDto,
	TokensDto
} from './dto';
import type { UserTokenPayload } from './types';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async getMe(token: string): Promise<AuthResponseDto> {
		const user = await this.extractUser(token);

		const secureUser = await this.usersService.getOne({ id: user.id, });

		const tokens = await this.generateTokens({
			id: secureUser.id,
			login: secureUser.login,
		});

		return {
			tokens,
			user: secureUser,
		};
	}

	async login(data: LoginDto): Promise<AuthResponseDto> {
		const { login, password, } = data;
		const user = await this.usersService.getOneInsecure({ login, });

		const correct = await compare(password, user.password);

		if (!correct) {
			throw new ForbiddenException('Invalid password');
		}

		const tokens = await this.generateTokens({
			id: user.id,
			login: user.login,
		});

		return {
			tokens,
			user: UsersService.secureUser(user),
		};
	}

	async registration(data: RegistrationDto): Promise<boolean> {
		return this.usersService.create(data).then(() => true);
	}

	async refresh(token: string): Promise<TokensDto> {
		const user = await this.extractUser(token).catch((err) => {
			throw new ForbiddenException('Invalid token', { cause: err, });
		});

		return this.generateTokens(user);
	}

	async extractUser(token: string): Promise<UserTokenPayload> {
		try {
			const [type, tokenBody] = token.split(' ');

			if (type !== 'Bearer') {
				throw type;
			}

			return await this.jwtService.verify(tokenBody, {
				secret: TOKEN_SECRET,
			});
		} catch (error) {
			throw new UnauthorizedException('Invalid token', { cause: error, });
		}
	}

	async generateTokens(user: UserTokenPayload): Promise<TokensDto> {
		const tokens = [
			this.jwtService.sign(user, {
				expiresIn: '15min',
				secret: TOKEN_SECRET,
			}),
			this.jwtService.sign(user, {
				expiresIn: '30d',
				secret: TOKEN_SECRET,
			})
		];

		const [accessToken, refreshToken] = await Promise.all(tokens);

		return {
			accessToken,
			refreshToken,
		};
	}
}
