import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { NormalizedPagination, databasePagination } from '@/shared/dto';
import { DeploysService } from '@/deploys/deploys.service';
import { ContractRepository, UpdateContractData } from './repositories';
import { CreateContractDto } from './dto';
import { Contract } from './entities';
import { SelectContract } from './types';

@Injectable()
export class ContractsService {
	constructor(
		private readonly contractRepository: ContractRepository,
		private readonly deploysService: DeploysService
	) {}

	/**
	 * Get all public contracts
	 * @public
	 * @async
	 * @param {NormalizedPagination} pagination request pagination
	 * @returns {Promise<Contract[]>}
	 */
	async getAll(pagination: NormalizedPagination): Promise<Contract[]> {
		return this.contractRepository.getAll(databasePagination(pagination), {
			isPrivate: false,
		});
	}

	/**
	 * Get all contracts allowed to user.
	 * Return all contracts allowed to user(all public and his private)
	 * @public
	 * @async
	 * @param {NormalizedPagination} pagination request pagination
	 * @param {string} userId uuid of requested user
	 * @returns {Promise<Contract[]>}
	 */
	async getAllByUser(
		pagination: NormalizedPagination,
		userId: string
	): Promise<Contract[]> {
		return this.contractRepository.getAll(databasePagination(pagination), {
			OR: [
				{
					ownerId: userId,
				},
				{
					NOT: {
						ownerId: userId,
					},
					isPrivate: false,
				}
			],
		});
	}

	/**
	 * Get one contract
	 * @public
	 * @async
	 * @param {SelectContract} params which contract select
	 * @param {string} userId uuid of requested user
	 * @returns {Promise<Contract>}
	 * @throws {NotFoundException} contract doesn't exist
	 * @throws {ForbiddenException} request private contract and user is not an owner
	 */
	async getOne(params: SelectContract, userId: string): Promise<Contract> {
		const contract = await this.contractRepository.getOne(params);

		if (!contract) {
			throw new NotFoundException(
				`Contract with id ${params.id} was not found`
			);
		}

		if (contract.isPrivate && contract.ownerId !== userId) {
			throw new ForbiddenException("You can't take this contract");
		}

		return contract;
	}

	/**
	 * Create new contract
	 * @public
	 * @async
	 * @param {CreateContractDto} dto data for creation
	 * @param {string} userId uuid of owner
	 * @returns {Promise<Contract>}
	 */
	async create(dto: CreateContractDto, userId: string): Promise<Contract> {
		return this.contractRepository.create({
			...dto,
			ownerId: userId,
		});
	}

	/**
	 * Update existing contract or throw error
	 * @public
	 * @async
	 * @param {SelectContract} params which contract select
	 * @param {UpdateContractData} dto new data for contract
	 * @returns {Promise<Contract>}
	 * @throws {NotFoundException}
	 */
	async update(
		params: SelectContract,
		dto: UpdateContractData
	): Promise<Contract> {
		const contract = await this.contractRepository.update(params, dto);

		if (!contract) {
			throw new NotFoundException(`Contract ${params.id} not found`);
		}

		return contract;
	}

	/**
	 * Remove contract
	 * @public
	 * @async
	 * @param {SelectContract} params which contract select
	 * @param {string} userId
	 * @returns {Promise<boolean>}
	 * @throws {NotFoundException}
	 */
	async remove(params: SelectContract, userId: string): Promise<boolean> {
		await this.deploysService.removeAll(params.id, userId);

		const contract = await this.contractRepository.remove(params);

		if (!contract) {
			throw new NotFoundException(`Contract ${params.id} not found`);
		}

		return !!contract;
	}
}
