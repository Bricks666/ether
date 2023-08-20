import { PartialType, PickType } from '@nestjs/swagger';
import { CreateContractDto } from './create-contract.dto';

export class UpdateContractDto extends PickType(
	PartialType(CreateContractDto),
	['name', 'isPrivate']
) {}
