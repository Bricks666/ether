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
import { Deploy } from './entities';
import { CreateDeployDto, RedeployDeployDto, UpdateDeployDto } from './dto';
import { DeploysService } from './deploys.service';

const ContractUuidParam = () => {
	return ApiParam({
		name: 'contractUuid',
		type: String,
		description: 'contract uuid',
	});
};

const DeployUuid = () => {
	return ApiParam({
		name: 'id',
		type: String,
		description: 'deploy uuid',
	});
};

const NotFound = () => {
	return ApiNotFoundResponse({
		description: "contract or deploy doesn't exist",
	});
};

@ApiTags('deploys')
@Controller('deploys/:contractUuid/')
export class DeploysController {
	constructor(private readonly deploysService: DeploysService) {}

	@ApiOperation({
		summary: 'get all allowed deploys',
	})
	@ContractUuidParam()
	@ApiOkResponse({
		type: Deploy,
		isArray: true,
		description: 'Allowed deploys',
	})
	@NotFound()
	@RequiredAccessToken()
	@Get('/')
	getAll(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@Query() pagination: PaginationDto,
		@AuthorizedUser() user: User
	): Promise<Deploy[]> {
		return this.deploysService.getAll(contractUuid, pagination, user.id);
	}

	@ApiOperation({
		summary: 'get latest allowed deploy',
	})
	@ApiQuery({
		name: 'deploy',
		type: String,
		description: 'specific deploy uuid',
		required: false,
	})
	@ContractUuidParam()
	@ApiOkResponse({
		type: Deploy,
		description: 'requested deploy',
	})
	@ApiNotFoundResponse({
		description: 'Contract or deploy not found',
	})
	@ApiBearerAuth()
	@ApiBasicAuth()
	@OneOfGuards(ApiTokenGuard, AccessTokenGuard)
	@Get('/latest')
	getLatest(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@AuthorizedUser() user: User,
		@Query('deploy', ParseUUIDPipe) deployUuid?: string | null
	): Promise<Deploy> {
		return this.deploysService.getLatest(contractUuid, user.id, deployUuid);
	}

	@ApiOperation({
		summary: 'get specific deploy',
	})
	@ContractUuidParam()
	@ApiOkResponse({
		type: Deploy,
		description: 'requested deploy',
	})
	@ApiNotFoundResponse({
		description: 'Contract or deploy not found',
	})
	@RequiredAccessToken()
	@Get('/:id')
	getOne(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@Param('id', ParseUUIDPipe) id: string,
		@AuthorizedUser() user: User
	): Promise<Deploy> {
		return this.deploysService.getOne(contractUuid, id, user.id);
	}

	@ApiOperation({
		summary: 'deploy contract',
	})
	@ApiConsumes('multipart/form-data')
	@ContractUuidParam()
	@ApiBody({
		type: CreateDeployDto,
		description: 'New deploy data',
	})
	@ApiOkResponse({
		type: Deploy,
		description: 'deploy info',
	})
	@ApiNotFoundResponse({
		description: "contract doesn't exist",
	})
	@RequiredAccessToken()
	@Post()
	create(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@Body() dto: CreateDeployDto,
		@UploadedFile() contract: Express.Multer.File,
		@AuthorizedUser() user: User
	): Promise<Deploy> {
		return this.deploysService.create(contractUuid, dto, contract, user.id);
	}

	@ApiOperation({
		summary: 'deploy contract based on already deployed',
	})
	@ApiBody({
		type: RedeployDeployDto,
		description: 'overwritten params',
	})
	@ContractUuidParam()
	@DeployUuid()
	@RequiredAccessToken()
	@Post('/:id/redeploy')
	redeploy(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: RedeployDeployDto,
		@AuthorizedUser() user: User
	): Promise<Deploy> {
		return this.deploysService.redeploy(contractUuid, id, dto, user.id);
	}

	@ApiOperation({ summary: 'update info about deploy', })
	@ContractUuidParam()
	@DeployUuid()
	@ApiBody({
		type: UpdateDeployDto,
		description: 'data for update',
	})
	@ApiOkResponse({
		type: Deploy,
		description: 'updated info',
	})
	@NotFound()
	@RequiredAccessToken()
	@Patch('/:id')
	update(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateDeployDto,
		@AuthorizedUser() user: User
	): Promise<Deploy> {
		return this.deploysService.update(contractUuid, id, dto, user.id);
	}

	@ApiOperation({ summary: 'remove deploy', })
	@ContractUuidParam()
	@DeployUuid()
	@ApiOkResponse({
		type: Boolean,
		description: 'is successful',
	})
	@NotFound()
	@RequiredAccessToken()
	@Delete('/:id')
	remove(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@Param('id', ParseUUIDPipe) id: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.deploysService.remove(contractUuid, id, user.id);
	}

	@ApiOperation({ summary: 'remove all deploys in contract', })
	@ContractUuidParam()
	@ApiOkResponse({
		type: Boolean,
		description: 'is successful',
	})
	@NotFound()
	@RequiredAccessToken()
	@Delete('/all')
	removeAll(
		@Param('contractUuid', ParseUUIDPipe) contractUuid: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.deploysService.removeAll(contractUuid, user.id);
	}
}
