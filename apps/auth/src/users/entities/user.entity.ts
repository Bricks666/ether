import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import {
	IsDateString,
	IsOptional,
	IsString,
	IsUUID,
	IsUrl,
	Length
} from 'class-validator';

export class User implements UserModel {
	@ApiProperty({
		type: String,
		description: "User's UUID",
		uniqueItems: true,
	})
	@IsUUID()
	declare id: string;

	@ApiProperty({
		type: String,
		description: 'Username',
	})
	@IsString()
	@Length(2)
	declare username: string;

	@ApiProperty({
		type: String,
		description: 'Unique login',
		uniqueItems: true,
	})
	@IsString()
	@Length(2)
	declare login: string;

	@ApiProperty({
		type: String,
		description: 'Password',
	})
	@IsString()
	declare password: string;

	@ApiProperty({
		type: String,
		description: 'Path to avatar if exists',
		nullable: true,
	})
	@IsUrl()
	@IsOptional()
	declare avatar: string | null;

	@ApiProperty({
		type: String,
		description: 'Date of registration',
	})
	@IsDateString()
	declare createdAt: Date;

	@ApiProperty({
		type: String,
		description: 'Date of last changing',
		nullable: true,
	})
	@IsDateString()
	@IsOptional()
	declare updatedAt: Date | null;
}
