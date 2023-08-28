import { PickType } from '@nestjs/swagger';
import { User } from '@/users/entities';

export class LoginDto extends PickType(User, ['login', 'password']) {}
