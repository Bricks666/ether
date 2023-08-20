import { PickType } from '@nestjs/swagger';
import { Wallet } from '../entities';

export class CreateWalletDto extends PickType(Wallet, [
	'address',
	'password'
]) {}
