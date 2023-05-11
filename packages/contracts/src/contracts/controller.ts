import { Request, Response } from 'express';
import { ContractsService, contractsService } from './service';
import {
	DeployRequestBody,
	DeployedResponseBody,
	GetByNameParams
} from './types';
import { ContractRow } from './repository';

class ContractsController {
	#contractsService: ContractsService;

	constructor(contractsService: ContractsService) {
		this.#contractsService = contractsService;
	}

	async getByName(req: Request<GetByNameParams>, res: Response<ContractRow>) {
		const { name, } = req.params;
		const contractRow = await this.#contractsService.getByName({ name, });
		return res.json(contractRow);
	}

	async deploy(
		req: Request<unknown, DeployedResponseBody, DeployRequestBody>,
		res: Response<DeployedResponseBody>
	) {
		const { senderAddress, senderIndex, ...params } = req.body;

		let contractRow: ContractRow;

		if (senderAddress !== undefined) {
			contractRow = await this.#contractsService.deployByAddress({
				...params,
				senderAddress,
			});
		} else if (senderIndex !== undefined) {
			contractRow = await this.#contractsService.deployByIndex({
				...params,
				senderIndex,
			});
		} else {
			return res.status(400).send();
		}

		return res.status(201).json(contractRow);
	}

	async deployByFile() {
		return null;
	}

	compileAndDeploy() {
		return null;
	}
}

export const contractsController = new ContractsController(contractsService);
