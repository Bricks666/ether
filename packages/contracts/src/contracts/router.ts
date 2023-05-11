import { Router } from 'express';
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
	'/deploy/file',
	contractsController.deployByFile.bind(contractsController)
);
contractsRouter.post(
	'/deploy/source',
	contractsController.compileAndDeploy.bind(contractsController)
);
