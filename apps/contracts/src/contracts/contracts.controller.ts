/* eslint-disable no-undef */
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseUUIDPipe,
	UploadedFile
} from '@nestjs/common';
import {
	ApiBasicAuth,
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags
} from '@nestjs/swagger';
import {
	AccessTokenGuard,
	ApiTokenGuard,
	AuthorizedUser,
	RequiredAccessToken
} from '@/security/lib';
import { OneOfGuards } from '@/shared/lib';
import { PaginationDto } from '@/shared/dto';
import { User } from '@/security/types';
import { ContractsService } from './contracts.service';
import { Contract } from './entities';
import {
	CreateContractDto,
	RedeployContractDto,
	UpdateContractDto
} from './dto';

const ContainerIdParam = () => {
	return ApiParam({
		name: 'containerId',
		type: String,
		description: 'container uuid',
	});
};

const ContractIdParam = () => {
	return ApiParam({
		name: 'id',
		type: String,
		description: 'contract uuid',
	});
};

const NotFound = () => {
	return ApiNotFoundResponse({
		description: "container or contract doesn't exist",
	});
};

@ApiTags('contracts')
@Controller('contracts/:containerId/')
export class ContractsController {
	constructor(private readonly deploysService: ContractsService) {}

	@ApiOperation({
		summary: 'get all allowed contracts',
	})
	@ContainerIdParam()
	@ApiOkResponse({
		type: Contract,
		isArray: true,
		description: 'Allowed contracts',
	})
	@NotFound()
	@RequiredAccessToken()
	@Get('/')
	getAll(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@Query() pagination: PaginationDto,
		@AuthorizedUser() user: User
	): Promise<Contract[]> {
		return this.deploysService.getAll(containerId, pagination, user.id);
	}

	@ApiOperation({
		summary: 'get latest allowed contract',
	})
	@ApiQuery({
		name: 'contract',
		type: String,
		description: 'specific contract uuid',
		required: false,
	})
	@ContainerIdParam()
	@ApiOkResponse({
		type: Contract,
		description: 'requested contract',
	})
	@ApiNotFoundResponse({
		description: 'Contract or contract not found',
	})
	@ApiBearerAuth()
	@ApiBasicAuth()
	@OneOfGuards(ApiTokenGuard, AccessTokenGuard)
	@Get('/latest')
	getLatest(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@AuthorizedUser() user: User,
		@Query('contract', ParseUUIDPipe) deployUuid?: string | null
	): Promise<Contract> {
		return this.deploysService.getLatest(containerId, user.id, deployUuid);
	}

	@ApiOperation({
		summary: 'get specific contract',
	})
	@ContainerIdParam()
	@ApiOkResponse({
		type: Contract,
		description: 'requested contract',
	})
	@ApiNotFoundResponse({
		description: 'Contract or contract not found',
	})
	@RequiredAccessToken()
	@Get('/:id')
	getOne(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@AuthorizedUser() user: User
	): Promise<Contract> {
		return this.deploysService.getOne(containerId, id, user.id);
	}

	@ApiOperation({
		summary: 'contract container',
	})
	@ApiConsumes('multipart/form-data')
	@ContainerIdParam()
	@ApiBody({
		type: CreateContractDto,
		description: 'New contract data',
	})
	@ApiOkResponse({
		type: Contract,
		description: 'contract info',
	})
	@ApiNotFoundResponse({
		description: "container doesn't exist",
	})
	@RequiredAccessToken()
	@Post()
	create(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@Body() dto: CreateContractDto,
		@UploadedFile() container: Express.Multer.File,
		@AuthorizedUser() user: User
	): Promise<Contract> {
		return this.deploysService.create(containerId, dto, container, user.id);
	}

	@ApiOperation({
		summary: 'contract container based on already deployed',
	})
	@ApiBody({
		type: RedeployContractDto,
		description: 'overwritten params',
	})
	@ContainerIdParam()
	@ContractIdParam()
	@RequiredAccessToken()
	@Post('/:id/redeploy')
	redeploy(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: RedeployContractDto,
		@AuthorizedUser() user: User
	): Promise<Contract> {
		return this.deploysService.redeploy(containerId, id, dto, user.id);
	}

	@ApiOperation({ summary: 'update info about contract', })
	@ContainerIdParam()
	@ContractIdParam()
	@ApiBody({
		type: UpdateContractDto,
		description: 'data for update',
	})
	@ApiOkResponse({
		type: Contract,
		description: 'updated info',
	})
	@NotFound()
	@RequiredAccessToken()
	@Patch('/:id')
	update(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateContractDto,
		@AuthorizedUser() user: User
	): Promise<Contract> {
		return this.deploysService.update(containerId, id, dto, user.id);
	}

	@ApiOperation({ summary: 'remove contract', })
	@ContainerIdParam()
	@ContractIdParam()
	@ApiOkResponse({
		type: Boolean,
		description: 'is successful',
	})
	@NotFound()
	@RequiredAccessToken()
	@Delete('/:id')
	remove(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@Param('id', ParseUUIDPipe) id: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.deploysService.remove(containerId, id, user.id);
	}

	@ApiOperation({ summary: 'remove all contracts in container', })
	@ContainerIdParam()
	@ApiOkResponse({
		type: Boolean,
		description: 'is successful',
	})
	@NotFound()
	@RequiredAccessToken()
	@Delete('/')
	removeAll(
		@Param('containerId', ParseUUIDPipe) containerId: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.deploysService.removeAll(containerId, user.id);
	}
}
