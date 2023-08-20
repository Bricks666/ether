import { ApiProperty } from '@nestjs/swagger';
import { Wallet as WalletModel } from '@prisma/client';
import { IsEthereumAddress, IsString, IsUUID } from 'class-validator';

export class Wallet implements WalletModel {
	@ApiProperty({
		type: String,
		description: 'Uuid of wallet',
	})
	@IsUUID()
	declare id: string;

	@ApiProperty({
		type: String,
		description: 'Uuid of owner',
	})
	declare userId: string;

	@ApiProperty({
		type: String,
		description: 'Wallet address',
	})
	@IsEthereumAddress()
	declare address: string;

	@ApiProperty({
		type: String,
		description: 'Password from wallet',
	})
	@IsString()
	declare password: string;
}
