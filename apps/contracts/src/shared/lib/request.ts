import { InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { env } from '../config';

export const request = async <T>(
	url: string,
	options: RequestInit = {}
): Promise<T> => {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new InternalServerErrorException('Fetch error', { cause: response });
	}

	if (isJSONResponse(response)) {
		return response.json();
	}

	return response.text() as T;
};

const isJSONResponse = (response: Response): boolean => {
	return response.headers.get('content-type').includes('application/json');
};

export const compileRequest = <T>(
	url: string,
	options: RequestInit = {}
): Promise<T> => {
	return request(join(env.COMPILER_HOST, url), options);
};
