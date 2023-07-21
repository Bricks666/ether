import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '@/users';

export class RegistrationDto extends OmitType(CreateUserDto, ['avatar']) {}
