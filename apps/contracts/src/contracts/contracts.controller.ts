import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Query,
	UseGuards
} from '@nestjs/common';
import { PaginationDto, normalizePagination } from '@/shared/dto';
import {
	AccessTokenGuard,
	ApiTokenGuard,
	AuthorizedUser,
	RequiredAccessToken
} from '@/security/lib';
import { User } from '@/security/types';
import { OneOfGuard, SetOneOf } from '@/shared/lib';
import { CreateContractDto } from './dto';
import { Contract } from './entities';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
	constructor(private readonly contractsService: ContractsService) {}

	@Get('/')
	async findAll(@Query() query: PaginationDto): Promise<Contract[]> {
		return this.contractsService.getAll(normalizePagination(query));
	}

	@SetOneOf(ApiTokenGuard, AccessTokenGuard)
	@UseGuards(OneOfGuard)
	@Get('/:id')
	async findOne(@Param('id') id: string, @AuthorizedUser() user: User) {
		return this.contractsService.getOne({ id, }, user.id);
	}

	@RequiredAccessToken()
	@Post('/')
	async create(@Body() dto: CreateContractDto, @AuthorizedUser() user: User) {
		return this.contractsService.create(dto, user.id);
	}

	// @Patch('/:id')
	// async update(
	// 	@Param('id') id: string,
	// 	@Body() updateContractDto: UpdateContractDto
	// ) {
	// 	return this.contractsService.update(+id, updateContractDto);
	// }

	// @Delete('/:id')
	// async remove(@Param('id') id: string) {
	// 	return this.contractsService.remove(+id);
	// }
}
