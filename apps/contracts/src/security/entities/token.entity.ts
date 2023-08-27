import { ApiProperty } from '@nestjs/swagger';
import { Token as TokenModel } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class Token implements TokenModel {
	@ApiProperty({
		type: String,
		description: 'Uuid of user',
	})
	@IsUUID()
	declare ownerId: string;

	@ApiProperty({
		type: String,
		description: 'User token',
	})
	@IsString()
	declare token: string;
}
