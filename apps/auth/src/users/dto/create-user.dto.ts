/* eslint-disable no-undef */
import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { User } from '../entities';

export class CreateUserDto extends PickType(User, [
	'login',
	'password',
	'username'
]) {
	@ApiPropertyOptional({
		type: String,
		format: 'binary',
		description:
			'User avatar photo, If pass null, current existing photo will be removed. If pass undefined it will be nothing',
		required: false,
		nullable: true,
	})
	@IsOptional()
	declare avatar?: Express.Multer.File | null;
}
