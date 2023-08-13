/* eslint-disable no-undef */
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';
import { Deploy } from '../entities';

export class CreateDeployDto extends PickType(Deploy, [
	'name',
	'walletId',
	'isPrivate'
]) {
	@ApiProperty({
		type: String,
		format: 'binary',
		description: 'sol contract',
	})
	@IsDefined()
	declare contract: Express.Multer.File;

	@ApiProperty({
		type: String,
		description: 'contract name in the contract file',
	})
	@IsString()
	declare contractName: string;

	@ApiPropertyOptional({
		description: 'contract name in the contract file',
		isArray: true,
	})
	@IsOptional()
	@IsArray()
	declare contractArguments?: any[];
}
