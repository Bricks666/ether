import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabasePagination } from '@/shared/dto';
import { SelectContract } from '../types';
import { Contract } from '../entities';
import { CreateContractDto, UpdateContractDto } from '../dto';

@Injectable()
export class ContractRepository {
	constructor(private readonly databaseService: PrismaDatabaseService) {}

	async getAll(
		pagination: DatabasePagination,
		filters?: GetAllContractFilters
	): Promise<Contract[]> {
		return this.databaseService.contract.findMany({
			...pagination,
			where: filters,
		});
	}

	async getOne(params: SelectContract): Promise<Contract | null> {
		const value = await this.databaseService.contract.findUnique({
			where: params,
		});

		return value ?? null;
	}

	async create(data: CreateContractData): Promise<Contract> {
		return this.databaseService.contract.create({
			data,
		});
	}

	async update(
		params: SelectContract,
		data: UpdateContractData
	): Promise<Contract> {
		return this.databaseService.contract.update({
			where: params,
			data,
		});
	}

	async remove(params: SelectContract): Promise<Contract> {
		return this.databaseService.contract.delete({
			where: params,
		});
	}
}

export interface CreateContractData extends CreateContractDto {
	readonly ownerId: string;
}

export interface UpdateContractData extends UpdateContractDto {}

export interface GetAllContractFilters extends Prisma.ContractWhereInput {}