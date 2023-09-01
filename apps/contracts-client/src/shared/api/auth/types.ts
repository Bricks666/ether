export interface User {
	readonly id: string;
	readonly login: string;
	readonly username: string;
	readonly avatar: string;
}

export interface Tokens {
	readonly accessToken: string;
	readonly refreshToken: string;
}

export interface LoginParams {
	readonly login: string;
	readonly password: string;
}

export interface AuthResponse {
	readonly user: User;
	readonly tokens: Tokens;
}

export interface RegistrationParams {
	readonly login: string;
	readonly password: string;
	readonly username: string;
}
