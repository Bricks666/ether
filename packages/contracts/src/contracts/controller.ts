import { Request, Response } from 'express';
import { AbiItem } from 'web3-utils';
import { filesValidators } from '@bricks-ether/server-utils';
import { ContractsService, contractsService } from './service';
import {
	DeployRequestBody,
	DeployedResponseBody,
	FileDeployRequestBody,
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

	async deployByFile(
		req: Request<unknown, DeployedResponseBody, FileDeployRequestBody>,
		res: Response<DeployedResponseBody>
	) {
		if (!filesValidators.isObject(req.files)) {
			return res.status(400).json({ error: 'files should be object', } as any);
		}
		const { abi, bytecode, } = req.files;
		const { senderAddress, senderIndex, ...rest } = req.body;
		const abiContent = JSON.parse(abi[0].buffer.toString()) as AbiItem[];
		const bytecodeContent = bytecode[0].buffer.toString();

		let contractRow: ContractRow;

		if (senderAddress !== undefined) {
			contractRow = await this.#contractsService.deployByAddress({
				...rest,
				abi: abiContent,
				bytecode: bytecodeContent,
				senderAddress,
			});
		} else if (senderIndex !== undefined) {
			contractRow = await this.#contractsService.deployByIndex({
				...rest,
				abi: abiContent,
				bytecode: bytecodeContent,
				senderIndex,
			});
		} else {
			return res.status(400).send();
		}

		return res.status(201).json(contractRow);
	}

	compileAndDeploy() {
		return null;
	}
}

export const contractsController = new ContractsController(contractsService);
