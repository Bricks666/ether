import { Web3Service, web3Service } from '../web3';
import {
	ContractRow,
	ContractsRepository,
	contractsRepository
} from './repository';
import {
	AddressDeployRequestBody,
	GetByNameParams,
	IndexDeployRequestBody
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
			throw new Error('not found');
		}

		return contract;
	}

	async deployByAddress(
		params: AddressDeployRequestBody
	): Promise<ContractRow> {
		const { abi, name, senderAddress, bytecode, contractsArgs, } = params;

		const existingContract = await this.#contractsRepository.getByName({
			name,
		});

		if (existingContract) {
			throw new Error('Conflict');
		}

		const web3Contract = new this.#web3Service.eth.Contract(abi);
		const response = await web3Contract
			.deploy({ data: bytecode, arguments: contractsArgs, })
			.send({ from: senderAddress, });

		const { address, } = response.options;
		return this.#contractsRepository.create({ address, name, });
	}

	async deployByIndex(params: IndexDeployRequestBody): Promise<ContractRow> {
		const { senderIndex, ...rest } = params;
		const senderAddress = await this.#web3Service.getAccountByIndex(
			senderIndex
		);
		return this.deployByAddress({ ...rest, senderAddress, });
	}

	// Может вынести в микросервис, который компилирует и возвращает байткод с аби
	compile() {
		return null;
	}
}

export const contractsService = new ContractsService(
	web3Service,
	contractsRepository
);
