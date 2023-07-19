/* eslint-disable no-undef */
import {
	Body,
	Controller,
	Put,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBody,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SecurityUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Put('/update')
	@ApiOperation({
		summary: '',
	})
	@ApiBody({
		type: UpdateUserDto,
		description: 'New user data info',
	})
	@ApiOkResponse({
		type: SecurityUserDto,
		description: 'Updated user',
	})
	@ApiNotFoundResponse({
		description: "User wasn't found",
	})
	@ApiInternalServerErrorResponse({
		description: "Couldn't save file or another error",
	})
	@UseInterceptors(FileInterceptor('avatar'))
	async update(
		@Body() body: UpdateUserDto,
		@UploadedFile('avatar') avatar?: Express.Multer.File | null
	): Promise<SecurityUserDto> {
		return this.usersService.update({ id: '', }, { ...body, avatar, });
	}
}
