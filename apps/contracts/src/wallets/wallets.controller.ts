import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	ParseUUIDPipe,
	Query
} from '@nestjs/common';
import {
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags
} from '@nestjs/swagger';
import { AuthorizedUser, RequiredAccessToken } from '@/security/lib';
import { User } from '@/security/types';
import { PaginationDto } from '@/shared/dto';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletsService } from './wallets.service';
import { Wallet } from './entities';

const ApiIdParam = () => {
	return ApiParam({
		name: 'id',
		type: String,
		description: 'Uuid of wallet',
	});
};

@ApiTags('wallets')
@RequiredAccessToken()
@Controller('wallets')
export class WalletsController {
	constructor(private readonly walletsService: WalletsService) {}

	@ApiOperation({
		summary: 'Get page of wallets of user',
	})
	@ApiOkResponse({
		type: Wallet,
		isArray: true,
		description: 'Wallets',
	})
	@Get('/')
	getAll(
		@Query() pagination: PaginationDto,
		@AuthorizedUser() user: User
	): Promise<Wallet[]> {
		return this.walletsService.getAll(pagination, user.id);
	}

	@ApiOperation({
		summary: 'Get special wallet',
	})
	@ApiIdParam()
	@ApiOkResponse({
		type: Wallet,
		description: 'Wallet',
	})
	@ApiNotFoundResponse({
		description: 'Wallet not found',
	})
	@Get('/:id')
	getOne(
		@Param('id', new ParseUUIDPipe()) id: string,
		@AuthorizedUser() user: User
	): Promise<Wallet> {
		return this.walletsService.getOne({ id, }, user.id);
	}

	@ApiOperation({
		summary: 'Add wallet to user',
	})
	@ApiBody({
		type: CreateWalletDto,
		description: 'Data of wallet',
	})
	@ApiCreatedResponse({
		type: Wallet,
		description: 'Created wallet',
	})
	@ApiConflictResponse({
		description: 'User not exists',
	})
	@Post('/')
	create(
		@Body() dto: CreateWalletDto,
		@AuthorizedUser() user: User
	): Promise<Wallet> {
		return this.walletsService.create(dto, user.id);
	}

	@ApiOperation({
		summary: 'Remove wallet',
	})
	@ApiIdParam()
	@ApiOkResponse({
		type: Boolean,
		description: 'Was removed or not',
	})
	@ApiNotFoundResponse({
		description: 'Wallet not found',
	})
	@Delete('/:id')
	remove(
		@Param('id', new ParseUUIDPipe()) id: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.walletsService.remove({ id, }, user.id);
	}
}
