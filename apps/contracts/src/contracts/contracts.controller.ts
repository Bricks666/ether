/* eslint-disable sonarjs/no-duplicate-string */
import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	Patch,
	Delete,
	ParseUUIDPipe
} from '@nestjs/common';
import {
	ApiBody,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags
} from '@nestjs/swagger';
import { PaginationDto, normalizePagination } from '@/shared/dto';
import { AuthorizedUser, RequiredAccessToken } from '@/security/lib';
import { User } from '@/security/types';
import { CreateContractDto, UpdateContractDto } from './dto';
import { Contract } from './entities';
import { ContractsService } from './contracts.service';

const ApiIdParam = () => {
	return ApiParam({
		type: String,
		name: 'id',
		description: 'contract uuid',
	});
};

@ApiTags('contracts')
@RequiredAccessToken()
@Controller('contracts')
export class ContractsController {
	constructor(private readonly contractsService: ContractsService) {}

	@ApiOperation({ summary: 'Take all public contracts', })
	@ApiOkResponse({
		type: Contract,
		isArray: true,
		description: 'Contracts',
	})
	@Get('/')
	async getAll(@Query() query: PaginationDto): Promise<Contract[]> {
		return this.contractsService.getAll(normalizePagination(query));
	}

	@ApiOperation({
		summary: 'Take one contract by uuid',
	})
	@ApiIdParam()
	@ApiOkResponse({
		type: Contract,
		description: 'Requested contract',
	})
	@ApiForbiddenResponse({
		description: "You don't have access to this contract",
	})
	@ApiNotFoundResponse({
		description: 'There is not this contract',
	})
	@Get('/:id')
	async getOne(
		@Param('id') id: string,
		@AuthorizedUser() user: User
	): Promise<Contract> {
		return this.contractsService.getOne({ id, }, user.id);
	}

	@ApiOperation({
		summary: 'Create new contract',
	})
	@ApiBody({
		type: CreateContractDto,
		description: 'Contract data',
	})
	@ApiOkResponse()
	@Post('/')
	async create(
		@Body() dto: CreateContractDto,
		@AuthorizedUser() user: User
	): Promise<Contract> {
		return this.contractsService.create(dto, user.id);
	}

	@ApiOperation({
		summary: 'Update contract data',
	})
	@ApiIdParam()
	@ApiBody({
		type: UpdateContractDto,
		description: 'New contract data',
	})
	@ApiOkResponse()
	@ApiNotFoundResponse()
	@Patch('/:id')
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateContractDto
	): Promise<Contract> {
		return this.contractsService.update({ id, }, dto);
	}

	@ApiOperation({
		summary: 'Remove contract data',
	})
	@ApiIdParam()
	@ApiOkResponse()
	@ApiNotFoundResponse()
	@Delete('/:id')
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.contractsService.remove({ id, }, user.id);
	}
}
