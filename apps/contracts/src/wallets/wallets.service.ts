/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletsService {
	async getAll(userId: string): Promise<any> {
		return `This action returns all wallets`;
	}

	async getOne(id: string, userId: string): Promise<any> {
		return `This action returns a #${id} wallet`;
	}

	async create(dto: CreateWalletDto, userId: string): Promise<any> {
		return 'This action adds a new wallet';
	}

	async update(id: string, dto: UpdateWalletDto, userId: string): Promise<any> {
		return `This action updates a #${id} wallet`;
	}

	async remove(id: string, userId: string): Promise<any> {
		return `This action removes a #${id} wallet`;
	}
}
