import { SecurityUserDto } from '@/users';

export interface Tokens {
	readonly accessToken: string;
	readonly refreshToken: string;
}

export interface AuthResponse {
	readonly user: SecurityUserDto;
	readonly tokens: Tokens;
}

export interface UserTokenPayload
	extends Pick<SecurityUserDto, 'login' | 'id'> {}
