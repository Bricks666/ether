import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories';
import { SelectUser } from './types';
import { User } from './entities';
import { SecurityUserDto } from './dto';

@Injectable()
export class UsersService {
	constructor(private readonly userRepository: UserRepository) {}

	async getOne(params: SelectUser) {
		const user = await this.userRepository.getOne(params);

		return UsersService.secureUser(user);
	}

	async create(data: CreateUserDto): Promise<SecurityUserDto> {
		const user = await this.userRepository.create(data);

		return UsersService.secureUser(user);
	}

	async update(params: SelectUser, data: UpdateUserDto): Promise<User> {
		const user = await this.userRepository.update(params, data);

		if (!user) {
			throw new NotFoundException("User wasn't found");
		}

		return user;
	}

	async remove(params: SelectUser): Promise<boolean> {
		const user = await this.userRepository.remove(params);

		return Boolean(user);
	}

	static secureUser(user: User): SecurityUserDto {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password: _, ...secureUser } = user;

		return secureUser;
	}
}
