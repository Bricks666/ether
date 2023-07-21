import { SecurityUserDto } from '@/users';

export interface UserTokenPayload
	extends Pick<SecurityUserDto, 'login' | 'id'> {}
