import { PickType } from '@nestjs/swagger';
import { Contract } from '../entities';

export class CreateContractDto extends PickType(Contract, [
	'name',
	'private',
]) {}
