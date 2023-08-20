/* eslint-disable max-classes-per-file */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Container as ContainerModel } from '@prisma/client';
import {
	IsBoolean,
	IsDateString,
	IsOptional,
	IsString,
	IsUUID
} from 'class-validator';

export class Container implements ContainerModel {
	@ApiProperty({
		type: String,
		description: 'Container uuid',
	})
	@IsUUID()
	declare id: string;

	@ApiProperty({
		type: String,
		description: 'Container name',
	})
	@IsString()
	declare name: string;

	@ApiProperty({
		type: String,
		description: 'Container owner uuid',
	})
	@IsUUID()
	declare ownerId: string;

	@ApiProperty({
		type: Boolean,
		default: false,
		description:
			"Flag Container is private or not. If it's true the container wouldn't allowed for others users",
	})
	@IsBoolean()
	@IsOptional()
	declare isPrivate: boolean;

	@ApiProperty({
		type: Date,
		description: 'When Container was uploaded',
	})
	@IsDateString()
	declare createdAt: Date;

	@ApiPropertyOptional({
		type: Date,
		description: 'When Container was updated or reuploaded last time',
	})
	@IsDateString()
	declare updatedAt: Date | null;
}
