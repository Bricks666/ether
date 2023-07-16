import {
	checkValidateErrors,
	filesValidators
} from '@bricks-ether/server-utils';
import { Router } from 'express';
import { body } from 'express-validator';
import { multer } from './lib';
import { compilerController } from './controller';

export const compilerRouter = Router();

compilerRouter.post(
	'/compile',
	multer.single('file'),
	body('file').custom(filesValidators.existsSingle),
	checkValidateErrors(),
	compilerController.compile.bind(compilerController)
);
