import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabasePagination } from '@/shared/dto';
import { Deploy } from '../entities';
import { CreateDeployDto, UpdateDeployDto } from '../dto';

@Injectable()
export class DeployRepository {
	constructor(private readonly databaseService: PrismaDatabaseService) {}

	async getAll(
		contractUuid: string,
		pagination: DatabasePagination,
		userId: string
	): Promise<Deploy[]> {
		return this.databaseService.deploy.findMany({
			where: {
				contractId: contractUuid,
				OR: createPrivacyFilters(userId),
			},
			...pagination,
		});
	}

	async getLatest(
		contractUuid: string,
		userId: string,
		deployUuid?: string | null
	): Promise<Deploy | null> {
		const id = deployUuid ?? undefined;
		const value = await this.databaseService.deploy.findFirst({
			where: {
				contractId: contractUuid,
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
		deployUuid: string,
		userId: string
	): Promise<Deploy | null> {
		const value = await this.databaseService.deploy.findUnique({
			where: {
				contractId: contractUuid,
				OR: createPrivacyFilters(userId),
				id: deployUuid,
			},
		});

		return value ?? null;
	}

	async create(data: CreateDeploy): Promise<Deploy> {
		return this.databaseService.deploy.create({
			data,
		});
	}

	async update(
		contractUuid: string,
		deployUuid: string,
		dto: UpdateDeployDto,
		userId: string
	): Promise<Deploy | null> {
		const value = await this.databaseService.deploy.update({
			data: dto,
			where: {
				id: deployUuid,
				contractId: contractUuid,
				OR: createPrivacyFilters(userId),
			},
		});
		return value ?? null;
	}

	async remove(
		contractUuid: string,
		deployUuid: string,
		userId: string
	): Promise<Deploy | null> {
		const value = await this.databaseService.deploy.delete({
			where: {
				id: deployUuid,
				contractId: contractUuid,
				OR: createPrivacyFilters(userId),
			},
		});
		return value ?? null;
	}

	async removeAll(contractUuid: string, userId: string): Promise<number> {
		return this.databaseService.deploy
			.deleteMany({
				where: {
					contractId: contractUuid,
					OR: createPrivacyFilters(userId),
				},
			})
			.then((value) => value.count);
	}
}

interface CreateDeploy extends Omit<CreateDeployDto, 'contract'> {
	readonly contractId: string;
	readonly compiledPath: string;
	readonly deployedAddress: string;
}

const createPrivacyFilters = (userId: string): Prisma.DeployWhereInput[] => {
	return [
		{
			contract: {
				ownerId: userId,
			},
		},
		{
			contract: {
				ownerId: userId,
				isPrivate: false,
			},
			isPrivate: false,
		}
	];
};
