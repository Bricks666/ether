import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDeployDto } from './create-deploy.dto';

export class UpdateDeployDto extends PartialType(
	PickType(CreateDeployDto, ['name', 'private'])
) {}
