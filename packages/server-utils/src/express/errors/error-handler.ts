import { HTTPError } from './http-errors';
import { HTTPCodes } from './error-codes';
import type { ErrorRequestHandler } from 'express';

export interface ErrorRequestHandlerResponseBody {
	readonly message: string;
	readonly statusCode: number;
	readonly cause: any;
}

export const createErrorHandler = <
	P,
	ResBody,
	ReqBody,
	ReqQuery,
	Locals extends Record<string, any>
>(): ErrorRequestHandler<
	P,
	ResBody | ErrorRequestHandlerResponseBody,
	ReqBody,
	ReqQuery,
	Locals
> => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (err, _req, res, _) => {
		if (err instanceof HTTPError) {
			return res.status(err.statusCode).json({
				message: err.message,
				cause: err.cause || 'not cause',
				statusCode: err.statusCode,
			});
		}
		if (err instanceof Error) {
			return res.status(HTTPCodes.InternalServerError).json({
				cause: err.cause || err,
				message: err.message,
				statusCode: HTTPCodes.InternalServerError,
			});
		}

		return res.status(HTTPCodes.InternalServerError).json({
			cause: err,
			message: 'Unexpected error with unknown cause',
			statusCode: HTTPCodes.InternalServerError,
		});
	};
};
