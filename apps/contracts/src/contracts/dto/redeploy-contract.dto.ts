/* eslint-disable no-undef */
import { PartialType, PickType } from '@nestjs/swagger';
import { CreateContractDto } from './create-contract.dto';

export class RedeployContractDto extends PartialType(
	PickType(CreateContractDto, ['name', 'walletId', 'isPrivate', 'contractName'])
) {}
