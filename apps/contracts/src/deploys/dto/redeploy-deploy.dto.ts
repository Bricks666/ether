/* eslint-disable no-undef */
import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDeployDto } from './create-deploy.dto';

export class RedeployDeployDto extends PartialType(
	PickType(CreateDeployDto, ['name', 'walletId', 'isPrivate', 'contractName'])
) {}
