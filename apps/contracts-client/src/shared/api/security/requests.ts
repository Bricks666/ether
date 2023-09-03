import { coreApi } from '../core';

import { ApiToken } from './types';

const url = 'security';

export const getToken = (): Promise<ApiToken | null> => {
	return coreApi.request(`${url}/api-token`).json();
};

export const generateToken = (): Promise<ApiToken> => {
	return coreApi
		.request(`${url}/api-token/generate`, { method: 'post' })
		.json();
};
