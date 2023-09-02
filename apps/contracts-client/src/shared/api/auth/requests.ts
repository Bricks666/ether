import { StatusResponse, coreApi } from '../core';
import { AuthResponse, LoginParams, RegistrationParams } from './types';

const url = 'auth';

export const auth = (): Promise<AuthResponse> => {
	return coreApi.request(`${url}/me`).json();
};

export const login = (params: LoginParams): Promise<AuthResponse> => {
	return coreApi
		.request(`${url}/login`, {
			json: params,
			method: 'post',
		})
		.json();
};

export const registration = (
	params: RegistrationParams
): Promise<StatusResponse> => {
	return coreApi
		.request(`${url}/registration`, {
			json: params,
			method: 'post',
		})
		.json();
};

export const logout = (): Promise<StatusResponse> => {
	return coreApi
		.request(`${url}/logout`, {
			method: 'delete',
		})
		.json();
};
