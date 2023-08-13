import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDeployDto } from './create-deploy.dto';

export class UpdateDeployDto extends PickType(PartialType(CreateDeployDto), [
	'name',
	'isPrivate'
]) {}
