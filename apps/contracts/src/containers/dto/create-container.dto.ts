import { PickType } from '@nestjs/swagger';
import { Container } from '../entities';

export class CreateContainerDto extends PickType(Container, [
	'name',
	'isPrivate'
]) {}
