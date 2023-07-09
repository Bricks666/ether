import {
	checkValidateErrors,
	createErrorHandler,
	filesValidators
} from '@bricks-ether/server-utils';
import { Router } from 'express';
import { body, oneOf, param } from 'express-validator';
import { multer } from '../shared/middlewares';
import { contractsController } from './controller';

export const contractsRouter = Router();

const createSenderValidator = () => {
	return oneOf([
		body('senderAddress').isString().trim().notEmpty().isEthereumAddress(),
		body('senderIndex').toInt().isNumeric()
	]);
};

contractsRouter.get(
	'/:name',
	param('name').isString().trim().notEmpty(),
	checkValidateErrors(),
	contractsController.getByName.bind(contractsController)
);
contractsRouter.post(
	'/deploy',
	createSenderValidator(),
	body('abi').isJSON().notEmpty(),
	body('bytecode').isString().trim().notEmpty(),
	body('name').isString().trim().notEmpty(),
	body('contractsArgs').optional().isArray(),
	createErrorHandler(),
	contractsController.deploy.bind(contractsController)
);
contractsRouter.post(
	'/deploy/files',
	multer.fields([
		{ name: 'abi', maxCount: 1, },
		{ name: 'bytecode', maxCount: 1, }
	]),
	createSenderValidator(),
	body('abi').custom(filesValidators.objectExistFile),
	body('bytecode').custom(filesValidators.objectExistFile),
	body('name').isString().trim().notEmpty(),
	body('contractsArgs').optional().isArray(),
	checkValidateErrors(),
	contractsController.deployByFile.bind(contractsController)
);
contractsRouter.post(
	'/deploy/source',
	multer.single('contract'),
	createSenderValidator(),
	body('contract').custom(filesValidators.existsSingle),
	body('name').isString().trim().notEmpty(),
	body('contractNameInFile').isString().trim().notEmpty(),
	body('contractsArgs').optional().isArray(),
	checkValidateErrors(),
	contractsController.compileAndDeploy.bind(contractsController)
);
