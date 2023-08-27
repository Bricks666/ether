import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { Injectable } from '@nestjs/common';
import { Token } from '../entities';

@Injectable()
export class TokenRepository {
	constructor(private readonly databaseService: PrismaDatabaseService) {}

	/**
	 * Get token of user
	 * @public
	 * @async
	 * @param {string} userId
	 * @returns {Promise<Token | null>}
	 */
	async getOne(userId: string): Promise<Token | null> {
		const value = await this.databaseService.token.findUnique({
			where: {
				ownerId: userId,
			},
		});
		return value ?? null;
	}

	/**
	 * Check if token exists
	 * @public
	 * @async
	 * @param {string} token
	 * @returns {Promise<boolean>}
	 */
	async tokenExists(token: string): Promise<boolean> {
		const value = await this.databaseService.token.count({
			where: {
				token,
			},
		});

		return !!value;
	}

	/**
	 * Add token to user
	 * @public
	 * @async
	 * @param {CreateToken} data
	 * @returns {Promise<Token>}
	 */
	create(data: CreateToken): Promise<Token> {
		return this.databaseService.token.create({
			data,
		});
	}

	/**
	 * Remove token to user
	 * @public
	 * @async
	 * @param {string} userId
	 * @returns {Promise<Token | null>}
	 */
	remove(userId: string): Promise<Token | null> {
		return this.databaseService.token.delete({
			where: {
				ownerId: userId,
			},
		});
	}
}

interface CreateToken {
	readonly ownerId: string;
	readonly token: string;
}
