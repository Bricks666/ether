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
import { CompiledContracts } from '@/contracts/types';
import { env } from '@/shared/config';
import { WalletsService } from '@/wallets/wallets.service';
import { Deploy } from './entities';
import { CreateDeployDto, RedeployDeployDto, UpdateDeployDto } from './dto';
import { DeployRepository } from './repositories';

@Injectable()
export class DeploysService {
	constructor(
		private readonly deployRepository: DeployRepository,
		private readonly filesService: FilesService,
		private readonly walletsService: WalletsService
	) {}

	async getAll(
		contractUuid: string,
		pagination: PaginationDto,
		userId: string
	): Promise<Deploy[]> {
		return this.deployRepository.getAll(
			contractUuid,
			databasePagination(normalizePagination(pagination)),
			userId
		);
	}

	async getLatest(
		contractUuid: string,
		userId: string,
		deployUuid?: string | null
	): Promise<Deploy> {
		const deploy = await this.deployRepository.getLatest(
			contractUuid,
			userId,
			deployUuid
		);

		if (!deploy) {
			throw new NotFoundException(
				`Contract with uuid ${contractUuid} or deploy with uuid ${
					deployUuid ?? 'all'
				} not found`
			);
		}

		return deploy;
	}

	async getOne(
		contractUuid: string,
		deployUuid: string,
		userId: string
	): Promise<Deploy> {
		const deploy = await this.deployRepository.getOne(
			contractUuid,
			userId,
			deployUuid
		);

		if (!deploy) {
			throw new NotFoundException(
				`Contract with uuid ${contractUuid} or deploy with uuid ${
					deployUuid ?? 'all'
				} not found`
			);
		}

		return deploy;
	}

	async create(
		contractUuid: string,
		dto: CreateDeployDto,
		contract: Express.Multer.File,
		userId: string
	): Promise<Deploy> {
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

		return this.deployRepository.create({
			contractId: contractUuid,
			compiledPath: clientPath,
			contractName: deployedAddress,
			isPrivate,
			name,
			walletId,
			deployedAddress,
		});
	}

	async redeploy(
		contractUuid: string,
		deployUuid: string,
		dto: RedeployDeployDto,
		userId: string
	): Promise<Deploy> {
		const deploy = await this.getOne(contractUuid, deployUuid, userId);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { id: _, compiledPath, ...rest } = deploy;

		const overwritten = { ...rest, ...dto, };

		const deployedAddress = await this.deploy({
			compiledPath,
			userId,
			...overwritten,
		});

		return this.deployRepository.create({
			...overwritten,
			compiledPath,
			deployedAddress,
			contractId: contractUuid,
		});
	}

	async update(
		contractUuid: string,
		deployUuid: string,
		dto: UpdateDeployDto,
		userId: string
	): Promise<Deploy> {
		const deploy = await this.deployRepository.update(
			contractUuid,
			deployUuid,
			dto,
			userId
		);

		if (!deploy) {
			throw new NotFoundException(
				`Contract with uuid ${contractUuid} or deploy with uuid ${deployUuid} not found`
			);
		}

		return deploy;
	}

	async remove(
		contractUuid: string,
		deployUuid: string,
		userId: string
	): Promise<boolean> {
		const deploy = await this.deployRepository.remove(
			contractUuid,
			deployUuid,
			userId
		);

		if (!deploy) {
			throw new NotFoundException(
				`Contract with uuid ${contractUuid} or deploy with uuid ${deployUuid} not found`
			);
		}

		return true;
	}

	async removeAll(contractUuid: string, userId: string): Promise<boolean> {
		const removeCount = await this.deployRepository.removeAll(
			contractUuid,
			userId
		);

		return !!removeCount;
	}

	private async deploy(params: DeployParams): Promise<Address> {
		const { compiledPath, userId, walletId, contractName, contractArguments, } =
			params;

		const compiled: CompiledContracts = await this.filesService
			.readFile({
				clientPath: compiledPath,
				encoding: 'utf-8',
			})
			.then(JSON.parse);

		const compiledContract = compiled[contractName];

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
