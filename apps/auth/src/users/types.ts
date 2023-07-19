import { CreateUserDto, UpdateUserDto } from './dto';

export interface SelectUserByLogin {
	readonly login: string;
}

export interface SelectUserById {
	readonly id: string;
}

export type SelectUser = SelectUserByLogin | SelectUserById;

export interface CreateUser extends CreateUserDto {
	readonly avatar?: string;
}

export interface UpdateUser extends UpdateUserDto {
	readonly avatar?: string;
}
