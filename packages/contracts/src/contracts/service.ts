import {
	ConflictError,
	InternalServerErrorError,
	NotFoundError,
} from '@bricks-ether/server-utils';
import { Web3Service, web3Service } from '../web3';
import {
	ContractRow,
	ContractsRepository,
	contractsRepository,
} from './repository';
import {
	AddressDeployRequestBody,
	CompileResponse,
	GetByNameParams,
	IndexDeployRequestBody,
} from './types';

export class ContractsService {
	#web3Service: Web3Service;

	#contractsRepository: ContractsRepository;

	constructor(
		web3Service: Web3Service,
		contractsRepository: ContractsRepository
	) {
		this.#web3Service = web3Service;
		this.#contractsRepository = contractsRepository;
	}

	async getByName(params: GetByNameParams): Promise<ContractRow> {
		const contract = await this.#contractsRepository.getByName(params);
		if (!contract) {
			throw new NotFoundError({
				message: `Contract with name ${params.name} not found`,
			});
		}

		return contract;
	}

	async deployByAddress(
		params: AddressDeployRequestBody
	): Promise<ContractRow> {
		const { abi, name, senderAddress, bytecode, contractsArgs } = params;

		const existingContract = await this.#contractsRepository.getByName({
			name,
		});

		if (existingContract) {
			throw new ConflictError({
				message: 'Contract with this name already exists',
				cause: existingContract,
			});
		}

		const web3Contract = new this.#web3Service.eth.Contract(abi);
		const response = await web3Contract
			.deploy({ data: bytecode, arguments: contractsArgs })
			.send({ from: senderAddress });

		const { address } = response.options;
		return this.#contractsRepository.create({ address, name });
	}

	async deployByIndex(params: IndexDeployRequestBody): Promise<ContractRow> {
		const { senderIndex, ...rest } = params;
		const senderAddress = await this.#web3Service.getAccountByIndex(
			senderIndex
		);
		return this.deployByAddress({ ...rest, senderAddress });
	}

	async compile(
		contract: globalThis.Express.Multer.File
	): Promise<CompileResponse> {
		const formData = new FormData();

		const file = new Blob([contract.buffer]);

		formData.append('file', file);

		const result = await fetch(`${process.env.COMPILER_HOST}/api/compile`, {
			body: formData,
			mode: 'cors',
			method: 'POST',
		});

		if (!result.ok) {
			throw new InternalServerErrorError({
				cause: await result.json(),
			});
		}

		return result.json().then((result) => result.contracts);
	}
}

export const contractsService = new ContractsService(
	web3Service,
	contractsRepository
);
