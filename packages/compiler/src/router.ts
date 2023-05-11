import { Router } from 'express';
import { multer } from './multer';
import { compilerController } from './controller';

export const compilerRouter = Router();

compilerRouter.get('/ping', async (_, res) => {
	res.json('pong');
});

compilerRouter.post(
	'/compile',
	multer.single('file'),
	compilerController.compile.bind(compilerController)
);
