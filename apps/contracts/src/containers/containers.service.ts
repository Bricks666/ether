import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { NormalizedPagination, databasePagination } from '@/shared/dto';
import { ContractsService } from '@/contracts/contracts.service';
import { ContainerRepository, UpdateContainerData } from './repositories';
import { SelectContainer } from './types';
import { Container } from './entities';
import { CreateContainerDto } from './dto';

@Injectable()
export class ContainersService {
	constructor(
		private readonly containerRepository: ContainerRepository,
		private readonly deploysService: ContractsService
	) {}

	/**
	 * Get all public containers
	 * @public
	 * @async
	 * @param {NormalizedPagination} pagination request pagination
	 * @returns {Promise<Container[]>}
	 */
	async getAll(pagination: NormalizedPagination): Promise<Container[]> {
		return this.containerRepository.getAll(databasePagination(pagination), {
			isPrivate: false,
		});
	}

	/**
	 * Get all containers allowed to user.
	 * Return all containers allowed to user(all public and his private)
	 * @public
	 * @async
	 * @param {NormalizedPagination} pagination request pagination
	 * @param {string} userId uuid of requested user
	 * @returns {Promise<Container[]>}
	 */
	async getAllByUser(
		pagination: NormalizedPagination,
		userId: string
	): Promise<Container[]> {
		return this.containerRepository.getAll(databasePagination(pagination), {
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
	 * Get one container
	 * @public
	 * @async
	 * @param {SelectContainer} params which container select
	 * @param {string} userId uuid of requested user
	 * @returns {Promise<Container>}
	 * @throws {NotFoundException} container doesn't exist
	 * @throws {ForbiddenException} request private container and user is not an owner
	 */
	async getOne(params: SelectContainer, userId: string): Promise<Container> {
		const container = await this.containerRepository.getOne(params);

		if (!container) {
			throw new NotFoundException(
				`Container with id ${params.id} was not found`
			);
		}

		if (container.isPrivate && container.ownerId !== userId) {
			throw new ForbiddenException("You can't take this container");
		}

		return container;
	}

	/**
	 * Create new container
	 * @public
	 * @async
	 * @param {CreateContainerDto} dto data for creation
	 * @param {string} userId uuid of owner
	 * @returns {Promise<Container>}
	 */
	async create(dto: CreateContainerDto, userId: string): Promise<Container> {
		return this.containerRepository.create({
			...dto,
			ownerId: userId,
		});
	}

	/**
	 * Update existing container or throw error
	 * @public
	 * @async
	 * @param {SelectContainer} params which container select
	 * @param {UpdateContainerData} dto new data for container
	 * @returns {Promise<Container>}
	 * @throws {NotFoundException}
	 */
	async update(
		params: SelectContainer,
		dto: UpdateContainerData
	): Promise<Container> {
		const container = await this.containerRepository.update(params, dto);

		if (!container) {
			throw new NotFoundException(`Container ${params.id} not found`);
		}

		return container;
	}

	/**
	 * Remove container
	 * @public
	 * @async
	 * @param {SelectContainer} params which container select
	 * @param {string} userId
	 * @returns {Promise<boolean>}
	 * @throws {NotFoundException}
	 */
	async remove(params: SelectContainer, userId: string): Promise<boolean> {
		await this.deploysService.removeAll(params.id, userId);

		const container = await this.containerRepository.remove(params);

		if (!container) {
			throw new NotFoundException(`Container ${params.id} not found`);
		}

		return !!container;
	}
}
