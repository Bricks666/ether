/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
	PaginationDto,
	databasePagination,
	normalizePagination
} from '@/shared/dto';
import { CreateWalletDto } from './dto';
import { SelectWallet } from './types';
import { WalletRepository } from './repositories';
import { Wallet } from './entities';

@Injectable()
export class WalletsService {
	constructor(private readonly walletRepository: WalletRepository) {}

	/**
	 * Get wallets page of user
	 * @public
	 * @async
	 * @param {PaginationDto} pagination
	 * @param {string} userId
	 * @returns {Promise<Wallet[]>}
	 */
	async getAll(pagination: PaginationDto, userId: string): Promise<Wallet[]> {
		return this.walletRepository.getAll(
			databasePagination(normalizePagination(pagination)),
			userId
		);
	}

	/**
	 * Get specific wallet of user
	 * @public
	 * @async
	 * @throws {NotFoundException}
	 * @param {SelectWallet} params
	 * @param {string} userId
	 * @returns  {Promise<Wallet>}
	 */
	async getOne(params: SelectWallet, userId: string): Promise<Wallet> {
		const wallet = await this.walletRepository.getOne(params, userId);

		if (!wallet) {
			throw new NotFoundException('There is not this wallet');
		}

		return wallet;
	}

	/**
	 * Create new wallet for user
	 * @public
	 * @async
	 * @param {CreateWalletDto} dto
	 * @param {string} userId
	 * @returns {Promise<Wallet>}
	 */
	async create(dto: CreateWalletDto, userId: string): Promise<Wallet> {
		return this.walletRepository.create(dto, userId);
	}

	/**
	 * Remove wallet for user
	 * @public
	 * @async
	 * @param {SelectWallet} params
	 * @param {string} userId
	 * @returns {Promise<boolean>}
	 */
	async remove(params: SelectWallet, userId: string): Promise<boolean> {
		const wallet = await this.walletRepository.remove(params, userId);

		if (!wallet) {
			throw new NotFoundException('There is not this wallet');
		}

		return true;
	}
}
