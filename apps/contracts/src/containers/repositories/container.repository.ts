import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabasePagination } from '@/shared/dto';
import { SelectContainer } from '../types';
import { Container } from '../entities';
import { CreateContainerDto, UpdateContainerDto } from '../dto';

@Injectable()
export class ContainerRepository {
	constructor(private readonly databaseService: PrismaDatabaseService) {}

	async getAll(
		pagination: DatabasePagination,
		filters?: GetAllContainerFilters
	): Promise<Container[]> {
		return this.databaseService.container.findMany({
			...pagination,
			where: filters,
		});
	}

	async getOne(params: SelectContainer): Promise<Container | null> {
		const value = await this.databaseService.container.findUnique({
			where: params,
		});

		return value ?? null;
	}

	async create(data: CreateContainerData): Promise<Container> {
		return this.databaseService.container.create({
			data,
		});
	}

	async update(
		params: SelectContainer,
		data: UpdateContainerData
	): Promise<Container> {
		return this.databaseService.container.update({
			where: params,
			data,
		});
	}

	async remove(params: SelectContainer): Promise<Container> {
		return this.databaseService.container.delete({
			where: params,
		});
	}
}

export interface CreateContainerData extends CreateContainerDto {
	readonly ownerId: string;
}

export interface UpdateContainerData extends UpdateContainerDto {}

export interface GetAllContainerFilters extends Prisma.ContainerWhereInput {}
