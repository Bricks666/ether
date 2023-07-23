import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { FilesService } from '@/files';
import { UserRepository } from './repositories';
import type { CreateUser, SelectUser, UpdateUser } from './types';
import type { User } from './entities';
import type { CreateUserDto, SecurityUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly filesService: FilesService
	) {}

	async getOne(params: SelectUser): Promise<SecurityUserDto> {
		const user = await this.userRepository.getOne(params);

		if (!user) {
			throw new NotFoundException("User wasn't found");
		}

		return UsersService.secureUser(user);
	}

	async getOneInsecure(params: SelectUser): Promise<User> {
		const user = await this.userRepository.getOne(params);

		if (!user) {
			throw new NotFoundException("User wasn't found");
		}

		return user;
	}

	async create(data: CreateUserDto): Promise<SecurityUserDto> {
		const { avatar, ...dto } = data;

		if (avatar) {
			const avatarPath = await this.filesService.writeFile(data.avatar);
			(dto as CreateUser).avatar = avatarPath;
		}

		try {
			const user = await this.userRepository.create(dto);

			return UsersService.secureUser(user);
		} catch (error) {
			throw new ConflictException('User already exists', { cause: error, });
		}
	}

	async update(
		params: SelectUser,
		data: UpdateUserDto
	): Promise<SecurityUserDto> {
		const { avatar, ...dto } = data;
		const currentUserData = await this.getOneInsecure(params);

		if (avatar !== undefined && currentUserData.avatar) {
			await this.filesService.removeFile(
				this.filesService.toFileSystemPath(currentUserData.avatar)
			);
		}

		if (avatar) {
			const avatarPath = await this.filesService.writeFile(avatar);
			(dto as UpdateUser).avatar = avatarPath;
		}

		const user = await this.userRepository.update(params, dto);

		return UsersService.secureUser(user);
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
