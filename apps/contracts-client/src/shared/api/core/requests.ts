import ky from 'ky';

import { API } from '@/shared/config';

let accessToken: string | null = null;

const getToken = () => {
	return `Bearer ${accessToken}`;
};

export const request = ky.create({
	prefixUrl: API,
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
			async (input, options, response) => {
				if (response.status === 401) {
					const token = await request('/auth/refresh').json<{
						readonly accessToken: string;
					}>();

					accessToken = token.accessToken;

					(options.headers as Headers).set('Authorization', getToken());

					return request(input, options);
				}
			},
		],
	},
});
