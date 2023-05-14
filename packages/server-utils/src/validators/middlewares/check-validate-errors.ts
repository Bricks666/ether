import { validationResult } from 'express-validator';
import { BadRequestError } from '../../errors';
import type { Handler } from 'express';

export const checkValidateErrors = (): Handler => {
	return (req, _, next) => {
		const result = validationResult(req);
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
