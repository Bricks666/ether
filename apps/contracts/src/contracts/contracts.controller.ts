/* eslint-disable sonarjs/no-duplicate-string */
import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	Patch,
	Delete
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
	async findAll(@Query() query: PaginationDto): Promise<Contract[]> {
		return this.contractsService.getAll(normalizePagination(query));
	}

	@ApiOperation({
		summary: 'Take one contract by uuid',
	})
	@ApiParam({
		type: Number,
		name: 'id',
		description: 'contract uuid',
	})
	@ApiOkResponse({
		type: Contract,
		description: 'Requested contract',
	})
	@ApiForbiddenResponse({
		description: 'You dont have access to this contract',
	})
	@ApiNotFoundResponse({
		description: 'There is not this contract',
	})
	@Get('/:id')
	async findOne(@Param('id') id: string, @AuthorizedUser() user: User) {
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
	async create(@Body() dto: CreateContractDto, @AuthorizedUser() user: User) {
		return this.contractsService.create(dto, user.id);
	}

	@ApiOperation({
		summary: 'Update contract data',
	})
	@ApiParam({
		type: Number,
		name: 'id',
		description: 'contract uuid',
	})
	@ApiBody({
		type: UpdateContractDto,
		description: 'New contract data',
	})
	@ApiOkResponse()
	@ApiNotFoundResponse()
	@Patch('/:id')
	async update(@Param('id') id: string, @Body() dto: UpdateContractDto) {
		return this.contractsService.update({ id, }, dto);
	}

	@ApiOperation({
		summary: 'Remove contract data',
	})
	@ApiParam({
		type: Number,
		name: 'id',
		description: 'contract uuid',
	})
	@ApiOkResponse()
	@ApiNotFoundResponse()
	@Delete('/:id')
	async remove(@Param('id') id: string) {
		return this.contractsService.remove({ id, });
	}
}
