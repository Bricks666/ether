import { Handler } from 'express';
import { validationResult } from 'express-validator';

export const checkValidateErrors = (): Handler => {
	return (req, _, next) => {
		const result = validationResult(req);
		if (result.isEmpty()) {
			return next();
		}

		return next(result.array());
	};
};
