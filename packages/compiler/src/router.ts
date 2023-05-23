import {
	checkValidateErrors,
	filesValidators
} from '@bricks-ether/server-utils';
import { Router } from 'express';
import { body } from 'express-validator';
import { multer } from './multer';
import { compilerController } from './controller';

export const compilerRouter = Router();

compilerRouter.get('/ping', async (_, res) => {
	res.json('pong');
});

compilerRouter.post(
	'/compile',
	multer.single('file'),
	body('file').custom(filesValidators.existsSingle),
	checkValidateErrors(),
	compilerController.compile.bind(compilerController)
);
