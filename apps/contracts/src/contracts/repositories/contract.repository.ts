import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabasePagination } from '@/shared/dto';
import { Contract } from '../entities';
import { CreateContractDto, UpdateContractDto } from '../dto';

@Injectable()
export class ContractRepository {
	constructor(private readonly databaseService: PrismaDatabaseService) {}

	async getAll(
		containerId: string,
		pagination: DatabasePagination,
		userId: string
	): Promise<Contract[]> {
		return this.databaseService.contract.findMany({
			where: {
				containerId,
				OR: createPrivacyFilters(userId),
			},
			...pagination,
		});
	}

	async getLatest(
		containerId: string,
		userId: string,
		contractUuid?: string | null
	): Promise<Contract | null> {
		const id = contractUuid ?? undefined;
		const value = await this.databaseService.contract.findFirst({
			where: {
				containerId,
				OR: createPrivacyFilters(userId),
				id,
			},
			orderBy: {
				deployedAt: 'desc',
			},
			take: 1,
		});

		return value ?? null;
	}

	async getOne(
		contractUuid: string,
		containerId: string,
		userId: string
	): Promise<Contract | null> {
		const value = await this.databaseService.contract.findUnique({
			where: {
				containerId,
				OR: createPrivacyFilters(userId),
				id: contractUuid,
			},
		});

		return value ?? null;
	}

	async create(data: CreateDeploy): Promise<Contract> {
		return this.databaseService.contract.create({
			data,
		});
	}

	async update(
		contractUuid: string,
		containerId: string,
		dto: UpdateContractDto,
		userId: string
	): Promise<Contract | null> {
		const value = await this.databaseService.contract.update({
			data: dto,
			where: {
				id: contractUuid,
				containerId,
				OR: createPrivacyFilters(userId),
			},
		});
		return value ?? null;
	}

	async remove(
		contractUuid: string,
		containerId: string,
		userId: string
	): Promise<Contract | null> {
		const value = await this.databaseService.contract.delete({
			where: {
				id: contractUuid,
				containerId,
				OR: createPrivacyFilters(userId),
			},
		});
		return value ?? null;
	}

	async removeAll(containerId: string, userId: string): Promise<number> {
		return this.databaseService.contract
			.deleteMany({
				where: {
					containerId,
					OR: createPrivacyFilters(userId),
				},
			})
			.then((value) => value.count);
	}
}

interface CreateDeploy extends Omit<CreateContractDto, 'contract'> {
	readonly containerId: string;
	readonly compiledPath: string;
	readonly deployedAddress: string;
}

const createPrivacyFilters = (userId: string): Prisma.ContractWhereInput[] => {
	return [
		{
			container: {
				ownerId: userId,
			},
		},
		{
			container: {
				ownerId: userId,
				isPrivate: false,
			},
			isPrivate: false,
		}
	];
};
