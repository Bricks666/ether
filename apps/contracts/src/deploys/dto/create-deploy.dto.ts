/* eslint-disable no-undef */
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Deploy } from '../entities';

export class CreateDeployDto extends PickType(Deploy, [
	'name',
	'walletId',
	'private'
]) {
	@ApiProperty({
		type: String,
		format: 'binary',
		description: 'sol contract',
	})
	@IsDefined()
	declare contract: Express.Multer.File;
}
