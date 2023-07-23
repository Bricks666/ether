import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { ROUND_COUNT } from '@/shared';
import { extractToken } from './lib';
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

	async getMe(rawToken: string): Promise<AuthResponseDto> {
		const token = extractToken(rawToken);

		if (!token) {
			throw new BadRequestException('Invalid authorization header', {
				cause: rawToken,
			});
		}

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
		const hashedPassword = await hash(data.password, ROUND_COUNT);
		return this.usersService
			.create({ ...data, password: hashedPassword, })
			.then(() => true);
	}

	async refresh(token: string): Promise<TokensDto> {
		const user = await this.extractUser(token).catch((err) => {
			throw new ForbiddenException('Invalid token', { cause: err, });
		});

		return this.generateTokens(user);
	}

	async extractUser(token: string): Promise<UserTokenPayload> {
		try {
			return await this.jwtService.verifyAsync(token);
		} catch (error) {
			throw new UnauthorizedException('Invalid token', { cause: error, });
		}
	}

	async generateTokens(user: UserTokenPayload): Promise<TokensDto> {
		const tokens = [
			this.jwtService.signAsync(user, {
				expiresIn: '15min',
			}),
			this.jwtService.signAsync(user, {
				expiresIn: '30d',
			})
		];

		const [accessToken, refreshToken] = await Promise.all(tokens);

		return {
			accessToken,
			refreshToken,
		};
	}
}
