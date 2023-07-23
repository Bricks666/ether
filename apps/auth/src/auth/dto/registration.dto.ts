import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '@/users/dto';

export class RegistrationDto extends OmitType(CreateUserDto, ['avatar']) {}
