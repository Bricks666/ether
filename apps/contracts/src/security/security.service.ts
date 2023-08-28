import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '@/shared/config';
import { User } from './types';
import { TokenRepository } from './repositories';
import { Token } from './entities';

@Injectable()
export class SecurityService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly tokenRepository: TokenRepository
	) {}

	/**
	 * Get token of user
	 * @public
	 * @async
	 * @param {string} userId
	 * @returns {Promise<Token | null>}
	 */
	async getToken(userId: string): Promise<Token | null> {
		return this.tokenRepository.getOne(userId);
	}

	/**
	 * Generate or re-generate api-token
	 * @public
	 * @async
	 * @param {User} user
	 * @returns {Promise<Token>}
	 */
	async generateToken(user: User): Promise<Token> {
		await this.tokenRepository.remove({ userId: user.id, });

		const token = await this.generate(user);

		return this.tokenRepository.create({
			ownerId: user.id,
			token,
		});
	}

	/**
	 * Validate api token
	 * @public
	 * @async
	 * @param {string} token
	 * @returns {Promise<boolean>}
	 */
	async validateApiToken(token: string): Promise<boolean> {
		return this.tokenRepository.tokenExists(token);
	}

	/**
	 * Extract auth user from token
	 * @param {string} token jwt token
	 * @returns {Promise<User>} verified user
	 * @throws {ForbiddenException} if token is invalid
	 */
	async extractUser(token: string): Promise<User> {
		try {
			return await this.jwtService.verifyAsync(token, {
				secret: env.TOKEN_SECRET,
			});
		} catch (error) {
			throw new ForbiddenException('Token is invalid', { cause: error, });
		}
	}

	/**
	 * Generate token with user
	 * @private
	 * @async
	 * @param {User} user
	 * @returns {Promise<string>}
	 */
	private async generate(user: User): Promise<string> {
		return this.jwtService.signAsync({ id: user.id, login: user.login, });
	}
}
