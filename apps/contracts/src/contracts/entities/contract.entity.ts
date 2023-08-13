/* eslint-disable max-classes-per-file */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Contract as ContractModel } from '@prisma/client';
import {
	IsBoolean,
	IsDateString,
	IsOptional,
	IsString,
	IsUUID
} from 'class-validator';

export class Contract implements ContractModel {
	@ApiProperty({
		type: String,
		description: 'contract uuid',
	})
	@IsUUID()
	declare id: string;

	@ApiProperty({
		type: String,
		description: 'contract name',
	})
	@IsString()
	declare name: string;

	@ApiProperty({
		type: String,
		description: 'contract owner uuid',
	})
	@IsUUID()
	declare ownerId: string;

	@ApiProperty({
		type: Boolean,
		default: false,
		description:
			"Flag contract is private or not. If it's true the contract wouldn't allowed for others users",
	})
	@IsBoolean()
	@IsOptional()
	declare isPrivate: boolean;

	@ApiProperty({
		type: Date,
		description: 'When contract was uploaded',
	})
	@IsDateString()
	declare createdAt: Date;

	@ApiPropertyOptional({
		type: Date,
		description: 'When contract was updated or reuploaded last time',
	})
	@IsDateString()
	declare updatedAt: Date | null;
}
