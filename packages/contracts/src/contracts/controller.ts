import { NextFunction, Request, Response } from 'express';
import { AbiItem } from 'web3-utils';
import { BadRequestError, HTTPCodes } from '@bricks-ether/server-utils';
import { ContractsService, contractsService } from './service';
import {
	CompileAndDeployRequestBody,
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

	async getByName(
		req: Request<GetByNameParams>,
		res: Response<ContractRow>,
		next: NextFunction
	) {
		try {
			const { name, } = req.params;
			const contractRow = await this.#contractsService.getByName({ name, });
			return res.json(contractRow);
		} catch (error) {
			next(error);
		}
	}

	async deploy(
		req: Request<unknown, DeployedResponseBody, DeployRequestBody>,
		res: Response<DeployedResponseBody>,
		next: NextFunction
	) {
		try {
			const { senderAddress, senderIndex, ...params } = req.body;

			let contractRow: ContractRow;

			if (senderAddress !== undefined) {
				contractRow = await this.#contractsService.deployByAddress({
					...params,
					senderAddress,
				});
			} else {
				contractRow = await this.#contractsService.deployByIndex({
					...params,
					senderIndex,
				});
			}
			return res.status(HTTPCodes.Created).json(contractRow);
		} catch (error) {
			next(error);
		}
	}

	async deployByFile(
		req: Request<unknown, DeployedResponseBody, FileDeployRequestBody>,
		res: Response<DeployedResponseBody>,
		next: NextFunction
	) {
		try {
			const { abi, bytecode, } = req.files as any;
			const { senderAddress, senderIndex, ...rest } = req.body;
			const abiContent = JSON.parse(abi[0].buffer.toString()) as AbiItem[];
			const bytecodeContent = bytecode[0].buffer.toString();

			let contractRow: ContractRow;

			if (senderAddress) {
				contractRow = await this.#contractsService.deployByAddress({
					...rest,
					abi: abiContent,
					bytecode: bytecodeContent,
					senderAddress,
				});
			} else {
				contractRow = await this.#contractsService.deployByIndex({
					...rest,
					abi: abiContent,
					bytecode: bytecodeContent,
					senderIndex: senderIndex!,
				});
			}

			return res.status(HTTPCodes.Created).json(contractRow);
		} catch (error) {
			next(error);
		}
	}

	async compileAndDeploy(
		req: Request<unknown, DeployedResponseBody, CompileAndDeployRequestBody>,
		res: Response<DeployedResponseBody>,
		next: NextFunction
	) {
		try {
			const contract = req.file!;
			const { contractNameInFile, senderAddress, senderIndex, ...rest } =
				req.body;

			const compiledContracts = await this.#contractsService.compile(contract);

			const deployContract = compiledContracts[contractNameInFile];

			if (!deployContract) {
				throw new BadRequestError({
					message: `Contract with name ${contractNameInFile} doesn't exist in passed file`,
				});
			}

			const { abi, bytecode, } = deployContract;

			let contractRow: ContractRow;

			if (senderAddress) {
				contractRow = await this.#contractsService.deployByAddress({
					...rest,
					abi,
					bytecode,
					senderAddress,
				});
			} else {
				contractRow = await this.#contractsService.deployByIndex({
					...rest,
					abi,
					bytecode,
					senderIndex: senderIndex!,
				});
			}

			return res.status(HTTPCodes.Created).json(contractRow);
		} catch (error) {
			next(error);
		}
	}
}

export const contractsController = new ContractsController(contractsService);
