import { Record, Static, String } from 'runtypes';

export const user = Record({
	id: String,
	login: String,
	username: String,
	avatar: String.nullable(),
	createdAt: String,
	updatedAt: String,
});

export interface User extends Static<typeof user> {}

const tokens = Record({
	accessToken: String,
	refreshToken: String,
});

export interface Tokens extends Static<typeof tokens> {}

export interface LoginParams {
	readonly login: string;
	readonly password: string;
}

export const authResponse = Record({
	user,
	tokens,
});

export interface AuthResponse extends Static<typeof authResponse> {}

export interface RegistrationParams {
	readonly login: string;
	readonly password: string;
	readonly username: string;
}
