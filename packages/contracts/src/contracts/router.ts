import { Router } from 'express';
import { body } from 'express-validator';
import { checkValidateErrors, multer } from '../shared/middlewares';
import { filesExistFile, singleFileExists } from '../shared/lib';
import { contractsController } from './controller';

export const contractsRouter = Router();

contractsRouter.get(
	'/:name',
	contractsController.getByName.bind(contractsController)
);
contractsRouter.post(
	'/deploy',
	contractsController.deploy.bind(contractsController)
);
contractsRouter.post(
	'/deploy/files',
	multer.fields([
		{ name: 'abi', maxCount: 1, },
		{ name: 'bytecode', maxCount: 1, }
	]),
	body('abi').custom(filesExistFile),
	body('bytecode').custom(filesExistFile),
	checkValidateErrors(),
	contractsController.deployByFile.bind(contractsController)
);
contractsRouter.post(
	'/deploy/source',
	multer.single('contract'),
	body('contract').custom(singleFileExists),
	checkValidateErrors(),
	contractsController.compileAndDeploy.bind(contractsController)
);
