import { HTTPError } from 'ky';

interface WithHttpError {
	readonly error: HTTPError;
}

export const isHttpError = <T>(
	params: T & { error: any }
): params is T & WithHttpError => {
	return params.error instanceof HTTPError;
};

export const isHttpErrorWithCode = (code: number) => {
	return <T>(params: T & { error: any }): boolean => {
		if (!isHttpError(params)) {
			return false;
		}

		return params.error.response.status === code;
	};
};
