import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { env } from '@/shared/config';
import { User } from './types';

@Injectable()
export class SecurityService {
	constructor(private readonly jwtService: JwtService) {}

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
}
