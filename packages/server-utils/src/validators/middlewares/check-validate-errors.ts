import { validationResult } from 'express-validator';
import { BadRequestError } from '../../errors';
import type { Request, RequestHandler } from 'express';

export const checkValidateErrors = <
	P,
	ResBody,
	ReqBody,
	ReqQuery,
	Locals extends Record<string, any>
>(): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
	return (req, _, next) => {
		const result = validationResult(req as Request);
		if (result.isEmpty()) {
			return next();
		}

		return next(
			new BadRequestError({
				cause: result.array(),
			})
		);
	};
};
