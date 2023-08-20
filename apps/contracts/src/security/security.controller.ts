import { Controller, Get, Post } from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags
} from '@nestjs/swagger';
import { AuthorizedUser, RequiredAccessToken } from './lib';
import { Token } from './entities';
import { SecurityService } from './security.service';
import { User } from './types';

@ApiTags('security')
@RequiredAccessToken()
@Controller('security')
export class SecurityController {
	constructor(private readonly securityService: SecurityService) {}

	@ApiOperation({
		summary: 'Get api-token',
	})
	@ApiOkResponse({
		type: Token,
		description: 'Generated token. May be null',
	})
	@Get('/api-token')
	async getToken(@AuthorizedUser() user: User): Promise<Token | null> {
		return this.securityService.getToken(user.id);
	}

	@ApiOperation({
		summary: 'Generate or re-generate api-toke',
	})
	@ApiCreatedResponse({
		type: Token,
		description: 'Created token',
	})
	@Post('/api-token/generate')
	async generateToken(@AuthorizedUser() user: User): Promise<Token> {
		return this.securityService.generateToken(user);
	}
}
