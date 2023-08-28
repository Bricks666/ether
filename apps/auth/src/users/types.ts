import { CreateUserDto, UpdateUserDto } from './dto';

export interface SelectUserByLogin {
	readonly login: string;
}

export interface SelectUserById {
	readonly id: string;
}

export type SelectUser = SelectUserByLogin | SelectUserById;

export interface CreateUser extends Omit<CreateUserDto, 'avatar'> {
	avatar?: string;
}

export interface UpdateUser extends Omit<UpdateUserDto, 'avatar'> {
	avatar?: string;
}
