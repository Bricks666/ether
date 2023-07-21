import { PickType } from '@nestjs/swagger';
import { User } from '@/users';

export class LoginDto extends PickType(User, ['login', 'password']) {}
