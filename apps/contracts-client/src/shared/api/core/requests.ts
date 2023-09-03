import ky from 'ky';

import { VITE_API } from '@/shared/config';

let accessToken: string | null = null;

const getToken = () => {
	return `Bearer ${accessToken}`;
};

const extractToken = (data: any): string | null => {
	if ('tokens' in data && 'accessToken' in data.tokens) {
		return data.tokens.accessToken ?? null;
	}

	if ('accessToken' in data) {
		return data.accessToken ?? null;
	}

	return null;
};

export const request = ky.create({
	prefixUrl: VITE_API,
	mode: 'cors',
	credentials: 'include',
	hooks: {
		beforeRequest: [
			(request) => {
				if (accessToken) {
					request.headers.append('Authorization', getToken());
				}

				return request;
			},
		],
		afterResponse: [
			async (_input, _options, response) => {
				if (!response.ok) {
					return response;
				}

				const data = await response.clone().json();

				const token = extractToken(data);

				if (token) {
					accessToken = token;
				}

				return response;
			},
			async (input, options, response) => {
				if (response.status === 401) {
					const token = await request('auth/refresh').json<{
						readonly accessToken: string;
					}>();

					accessToken = token.accessToken;

					(options.headers as Headers).set('Authorization', getToken());

					return request(input, options);
				}

				return response;
			},
		],
	},
});
