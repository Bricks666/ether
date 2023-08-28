import { SecurityUserDto } from '@/users/dto';

export interface UserTokenPayload
	extends Pick<SecurityUserDto, 'login' | 'id'> {}
