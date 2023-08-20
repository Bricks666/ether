import { Injectable } from '@nestjs/common';
import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { DatabasePagination } from '@/shared/dto';
import { Wallet } from '../entities';
import { SelectWallet } from '../types';
import { CreateWalletDto } from '../dto';

@Injectable()
export class WalletRepository {
	constructor(private readonly databaseService: PrismaDatabaseService) {}

	async getAll(
		pagination: DatabasePagination,
		userId: string
	): Promise<Wallet[]> {
		return this.databaseService.wallet.findMany({
			...pagination,
			where: {
				userId,
			},
		});
	}

	async getOne(params: SelectWallet, userId: string): Promise<Wallet | null> {
		const value = await this.databaseService.wallet.findUnique({
			where: {
				id: params.id,
				userId,
			},
		});
		return value ?? null;
	}

	async create(dto: CreateWalletDto, userId: string): Promise<Wallet> {
		return this.databaseService.wallet.create({
			data: {
				...dto,
				userId,
			},
		});
	}

	async remove(params: SelectWallet, userId: string): Promise<Wallet | null> {
		const value = await this.databaseService.wallet.delete({
			where: {
				id: params.id,
				userId,
			},
		});
		return value ?? null;
	}
}
