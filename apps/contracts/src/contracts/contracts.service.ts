import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ContractRepository, UpdateContractData } from './repositories';
import { CreateContractDto } from './dto';
import { Contract } from './entities';
import { NormalizedPagination, databasePagination } from '@/shared/dto';
import { SelectContract } from './types';

@Injectable()
export class ContractsService {
	constructor(private readonly contractRepository: ContractRepository) {}

	async getAll(pagination: NormalizedPagination): Promise<Contract[]> {
		return this.contractRepository.getAll(databasePagination(pagination), {
			private: false,
		});
	}

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
					private: false,
				},
			],
		});
	}

	async getOne(params: SelectContract, userId: string): Promise<Contract> {
		const contract = await this.contractRepository.getOne(params);

		if (!contract) {
			throw new NotFoundException(
				`Contract with id ${params.id} was not found`
			);
		}

		if (contract.private && contract.ownerId !== userId) {
			throw new ForbiddenException("You can't take this contract");
		}

		return contract;
	}

	createFromSource(
		dto: CreateContractDto,
		userId: string,
		source: globalThis.Express.Multer.File
	) {
		return 'This action adds a new contract';
	}

	createFromPrecompiled(dto: CreateContractDto, userId: string) {
		return 'This action adds a new contract';
	}

	update(params: SelectContract, dto: UpdateContractData) {
		return `This action updates a #${id} contract`;
	}

	remove(params: SelectContract) {
		return `This action removes a #${id} contract`;
	}
}
