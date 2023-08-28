/* eslint-disable no-undef */
import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesService } from '@bricks-ether/server-utils/nestjs';
import Web3, { Address, Personal } from 'web3';
import {
	PaginationDto,
	databasePagination,
	normalizePagination
} from '@/shared/dto';
import { compileRequest } from '@/shared/lib';
import { env } from '@/shared/config';
import { WalletsService } from '@/wallets/wallets.service';
import { ContractRepository } from './repositories';
import { Contract } from './entities';
import { CompileResponseBody, CompiledContracts } from './types';
import {
	CreateContractDto,
	RedeployContractDto,
	UpdateContractDto
} from './dto';

@Injectable()
export class ContractsService {
	constructor(
		private readonly contractRepository: ContractRepository,
		private readonly filesService: FilesService,
		private readonly walletsService: WalletsService
	) {}

	async getAll(
		containerId: string,
		pagination: PaginationDto,
		userId: string
	): Promise<Contract[]> {
		return this.contractRepository.getAll(
			containerId,
			databasePagination(normalizePagination(pagination)),
			userId
		);
	}

	async getLatest(
		containerId: string,
		userId: string,
		contractId?: string | null
	): Promise<Contract> {
		const contract = await this.contractRepository.getLatest(
			containerId,
			userId,
			contractId
		);

		if (!contract) {
			throw new NotFoundException(
				`Container with uuid ${containerId} or contract with uuid ${
					contractId ?? 'all'
				} not found`
			);
		}

		return contract;
	}

	async getOne(
		containerId: string,
		contractId: string,
		userId: string
	): Promise<Contract> {
		const contract = await this.contractRepository.getOne(
			containerId,
			userId,
			contractId
		);

		if (!contract) {
			throw new NotFoundException(
				`Container with uuid ${containerId} or contract with uuid ${
					contractId ?? 'all'
				} not found`
			);
		}

		return contract;
	}

	async create(
		containerId: string,
		dto: CreateContractDto,
		contract: Express.Multer.File,
		userId: string
	): Promise<Contract> {
		const {
			contractName,
			name,
			walletId,
			contractArguments,
			isPrivate = false,
		} = dto;

		const formData = new FormData();

		formData.append('file', new Blob([contract.buffer]));

		const compiled = await compileRequest<CompiledContracts>('/compile', {
			body: formData,
			method: 'POST',
		});

		const clientPath = await this.filesService.writeFile({
			content: JSON.stringify(compiled),
			extension: '.json',
		});

		const deployedAddress = await this.deploy({
			compiledPath: clientPath,
			contractName,
			walletId,
			contractArguments,
			userId,
		});

		return this.contractRepository.create({
			compiledPath: clientPath,
			contractName: deployedAddress,
			isPrivate,
			containerId,
			name,
			walletId,
			deployedAddress,
		});
	}

	async redeploy(
		containerId: string,
		contractId: string,
		dto: RedeployContractDto,
		userId: string
	): Promise<Contract> {
		const contract = await this.getOne(containerId, contractId, userId);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, compiledPath, ...rest } = contract;

		const overwritten = { ...rest, ...dto, };

		const deployedAddress = await this.deploy({
			compiledPath,
			userId,
			...overwritten,
		});

		return this.contractRepository.create({
			...overwritten,
			compiledPath,
			deployedAddress,
			containerId,
		});
	}

	async update(
		containerId: string,
		contractId: string,
		dto: UpdateContractDto,
		userId: string
	): Promise<Contract> {
		const contract = await this.contractRepository.update(
			containerId,
			contractId,
			dto,
			userId
		);

		if (!contract) {
			throw new NotFoundException(
				`Container with uuid ${containerId} or contract with uuid ${contractId} not found`
			);
		}

		return contract;
	}

	async remove(
		containerId: string,
		contractId: string,
		userId: string
	): Promise<boolean> {
		const contract = await this.contractRepository.remove(
			containerId,
			contractId,
			userId
		);

		if (!contract) {
			throw new NotFoundException(
				`Container with uuid ${containerId} or contract with uuid ${contractId} not found`
			);
		}

		return true;
	}

	async removeAll(containerId: string, userId: string): Promise<boolean> {
		const removeCount = await this.contractRepository.removeAll(
			containerId,
			userId
		);

		return !!removeCount;
	}

	private async deploy(params: DeployParams): Promise<Address> {
		const { compiledPath, userId, walletId, contractName, contractArguments, } =
			params;

		const compiled: CompileResponseBody = await this.filesService
			.readFile({
				clientPath: compiledPath,
				encoding: 'utf-8',
			})
			.then(JSON.parse);

		const compiledContract = compiled.contracts[contractName];

		if (!compiledContract) {
			throw new NotFoundException(
				`Contract ${contractName} not exists in passed file`
			);
		}

		const { abi, bytecode, } = compiledContract;

		const web3 = new Web3(env.NODE_HOST);

		const contract = new web3.eth.Contract(abi);

		const wallet = await this.walletsService.getOne({ id: walletId, }, userId);

		const personal = new Personal(env.NODE_HOST);
		await personal.unlockAccount(wallet.address, wallet.password, 0);

		const deployed = await contract
			.deploy({
				data: bytecode,
				arguments: contractArguments as never,
			})
			.send({
				from: wallet.address,
			});

		await personal.lockAccount(wallet.address);

		return deployed.options.address;
	}
}

interface DeployParams {
	readonly compiledPath: string;
	readonly walletId: string;
	readonly userId: string;
	readonly contractName: string;
	readonly contractArguments?: any[];
}
