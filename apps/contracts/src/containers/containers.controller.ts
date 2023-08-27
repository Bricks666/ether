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
import { ContainersService } from './containers.service';
import { Container } from './entities';
import { CreateContainerDto, UpdateContainerDto } from './dto';

const ApiIdParam = () => {
	return ApiParam({
		type: String,
		name: 'id',
		description: 'Container uuid',
	});
};

@ApiTags('containers')
@RequiredAccessToken()
@Controller('containers')
export class ContainersController {
	constructor(private readonly containersService: ContainersService) {}

	@ApiOperation({ summary: 'Take all public containers', })
	@ApiOkResponse({
		type: Container,
		isArray: true,
		description: 'Contracts',
	})
	@Get('/')
	async getAll(@Query() query: PaginationDto): Promise<Container[]> {
		return this.containersService.getAll(normalizePagination(query));
	}

	@ApiOperation({
		summary: 'Take one container by uuid',
	})
	@ApiIdParam()
	@ApiOkResponse({
		type: Container,
		description: 'Requested container',
	})
	@ApiForbiddenResponse({
		description: "You don't have access to this container",
	})
	@ApiNotFoundResponse({
		description: 'There is not this container',
	})
	@Get('/:id')
	async getOne(
		@Param('id') id: string,
		@AuthorizedUser() user: User
	): Promise<Container> {
		return this.containersService.getOne({ id, }, user.id);
	}

	@ApiOperation({
		summary: 'Create new container',
	})
	@ApiBody({
		type: CreateContainerDto,
		description: 'Container data',
	})
	@ApiOkResponse()
	@Post('/')
	async create(
		@Body() dto: CreateContainerDto,
		@AuthorizedUser() user: User
	): Promise<Container> {
		return this.containersService.create(dto, user.id);
	}

	@ApiOperation({
		summary: 'Update container data',
	})
	@ApiIdParam()
	@ApiBody({
		type: UpdateContainerDto,
		description: 'New container data',
	})
	@ApiOkResponse()
	@ApiNotFoundResponse()
	@Patch('/:id')
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateContainerDto
	): Promise<Container> {
		return this.containersService.update({ id, }, dto);
	}

	@ApiOperation({
		summary: 'Remove container data',
	})
	@ApiIdParam()
	@ApiOkResponse()
	@ApiNotFoundResponse()
	@Delete('/:id')
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
		@AuthorizedUser() user: User
	): Promise<boolean> {
		return this.containersService.remove({ id, }, user.id);
	}
}