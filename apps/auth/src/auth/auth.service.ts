import {
	ForbiddenException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { type SecurityUserDto, UsersService } from '@/users';
import type { LoginDto, RegistrationDto } from './dto';
import type { AuthResponse, Tokens, UserTokenPayload } from './types';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async getMe(token: string): Promise<SecurityUserDto> {
		const user = await this.extractUser(token);

		return this.usersService.getOne({ id: user.id, });
	}

	async login(data: LoginDto): Promise<AuthResponse> {
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

	async registration(data: RegistrationDto): Promise<SecurityUserDto> {
		return this.usersService.create(data);
	}

	async refresh(token: string): Promise<Tokens> {
		const user = await this.extractUser(token).catch((err) => {
			throw new ForbiddenException('Invalid token', { cause: err, });
		});

		return this.generateTokens(user);
	}

	async extractUser(token: string): Promise<UserTokenPayload> {
		try {
			return await this.jwtService.verify(token, {
				secret: process.env.TOKEN_SECRET,
			});
		} catch (error) {
			throw new UnauthorizedException('Invalid token', { cause: error, });
		}
	}

	async generateTokens(user: UserTokenPayload): Promise<Tokens> {
		const tokens = [
			this.jwtService.sign(user, {
				expiresIn: '15min',
				secret: process.env.TOKEN_SECRET,
			}),
			this.jwtService.sign(user, {
				expiresIn: '30d',
				secret: process.env.TOKEN_SECRET,
			})
		];

		const [accessToken, refreshToken] = await Promise.all(tokens);

		return {
			accessToken,
			refreshToken,
		};
	}
}
