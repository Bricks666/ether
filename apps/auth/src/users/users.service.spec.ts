/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FilesService } from '@/files';
import { UsersService } from './users.service';
import { UserRepository } from './repositories';
import { User } from './entities';
import { SelectUser } from './types';
import { CreateUserDto, UpdateUserDto } from './dto';

const mockUser: User = {
	id: 'id',
	login: 'login',
	username: 'username',
	password: 'password',
	createdAt: new Date(),
	updatedAt: new Date(),
	avatar: null,
};

const mockUserWithAvatar: User = {
	...mockUser,
	avatar: 'path',
};

const { password: _, ...mockSecurityUser } = mockUser;

const mockSelect: SelectUser = { id: 'id', };

const error = new Error('Mock error');

const mockAvatar = {} as Express.Multer.File;

const mockWritePath = 'mock write path';
const mockFileSystemPath = 'file system path';

describe('UsersService', () => {
	let usersService: UsersService;
	let filesService: jest.MockedObjectDeep<FilesService>;
	let userRepository: jest.MockedObjectDeep<UserRepository>;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: FilesService,
					useValue: {
						writeFile: jest.fn().mockResolvedValue(mockWritePath),
						removeFile: jest.fn(),
						toFileSystemPath: jest.fn().mockReturnValue(mockFileSystemPath),
					},
				},
				{
					provide: UserRepository,
					useValue: {
						getOne: jest.fn(() => mockUserWithAvatar),
						create: jest.fn(() => mockUserWithAvatar),
						update: jest.fn(() => mockUserWithAvatar),
						remove: jest.fn(() => mockUserWithAvatar),
					},
				}
			],
		}).compile();

		usersService = module.get(UsersService);
		filesService = module.get(FilesService);
		userRepository = module.get(UserRepository);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('should be defined', () => {
		expect(usersService).toBeDefined();
	});

	describe('getOne', () => {
		let secureUserSpy: jest.MockInstance<any, any>;

		beforeAll(() => {
			secureUserSpy = jest
				.spyOn<any, any>(UsersService, 'secureUser')
				.mockReturnValue(mockSecurityUser);
		});

		afterAll(() => {
			secureUserSpy.mockRestore();
		});

		test('should pass select params to repository', async () => {
			await usersService.getOne(mockSelect);

			expect(userRepository.getOne).toHaveBeenCalledTimes(1);
			expect(userRepository.getOne).toHaveBeenCalledWith(mockSelect);
		});

		test('should return secured user', async () => {
			const result = await usersService.getOne(mockSelect);

			expect(result).toBe(mockSecurityUser);
			expect(secureUserSpy).toHaveBeenCalledTimes(1);
			expect(secureUserSpy).toHaveBeenCalledWith(mockUserWithAvatar);
		});

		test('should throw error if repository thrown', async () => {
			userRepository.getOne.mockRejectedValueOnce(error);
			expect(() => usersService.getOne(mockSelect)).rejects.toThrowError(error);
		});

		test('should throw error if there is no user', async () => {
			userRepository.getOne.mockResolvedValueOnce(null);
			expect(() => usersService.getOne(mockSelect)).rejects.toThrowError(
				new NotFoundException("User wasn't found")
			);
		});
	});

	describe('getOneInsecure', () => {
		test('should pass select params to repository', async () => {
			await usersService.getOneInsecure(mockSelect);

			expect(userRepository.getOne).toHaveBeenCalledTimes(1);
			expect(userRepository.getOne).toHaveBeenCalledWith(mockSelect);
		});

		test('should return insecure user', async () => {
			const result = await usersService.getOneInsecure(mockSelect);

			expect(result).toBe(mockUserWithAvatar);
		});

		test('should throw error if repository thrown', async () => {
			userRepository.getOne.mockRejectedValueOnce(error);
			expect(() =>
				usersService.getOneInsecure(mockSelect)
			).rejects.toThrowError(error);
		});

		test('should throw error if there is no user', async () => {
			userRepository.getOne.mockResolvedValueOnce(null);
			expect(() =>
				usersService.getOneInsecure(mockSelect)
			).rejects.toThrowError(new NotFoundException("User wasn't found"));
		});
	});

	describe('create', () => {
		const data = {
			id: 'id',
			login: 'login',
			username: 'username',
			password: 'password',
		} as CreateUserDto;

		let secureUserSpy: jest.MockInstance<any, any>;

		beforeAll(() => {
			secureUserSpy = jest
				.spyOn<any, any>(UsersService, 'secureUser')
				.mockReturnValue(mockSecurityUser);
		});

		afterAll(() => {
			secureUserSpy.mockRestore();
		});

		test('should pass data params to repository', async () => {
			await usersService.create(data);

			expect(userRepository.create).toHaveBeenCalledTimes(1);
			expect(userRepository.create).toHaveBeenCalledWith(data);
		});

		test("shouldn't call writeFile if avatar not passed", async () => {
			await usersService.create(data);

			expect(filesService.writeFile).toHaveBeenCalledTimes(0);
		});

		test('should call writeFile if avatar passed', async () => {
			await usersService.create({ ...data, avatar: mockAvatar, });

			expect(filesService.writeFile).toHaveBeenCalledTimes(1);
			expect(filesService.writeFile).toHaveBeenCalledWith(mockAvatar);
			expect(userRepository.create).toHaveBeenCalledWith({
				...data,
				avatar: mockWritePath,
			});
		});

		test('should return secure user', async () => {
			const result = await usersService.create(data);

			expect(result).toBe(mockSecurityUser);
			expect(secureUserSpy).toHaveBeenCalledTimes(1);
			expect(secureUserSpy).toHaveBeenCalledWith(mockUserWithAvatar);
		});

		test('should throw wrapped error if repository thrown', async () => {
			userRepository.create.mockRejectedValueOnce(error);
			expect(() => usersService.create(data)).rejects.toThrowError(
				new ConflictException('User already exists', { cause: error, })
			);
		});
	});

	describe('update', () => {
		const data = {
			username: 'username',
			password: 'password',
		} as UpdateUserDto;

		let secureUserSpy: jest.MockInstance<any, any>;

		beforeAll(() => {
			secureUserSpy = jest
				.spyOn<any, any>(UsersService, 'secureUser')
				.mockReturnValue(mockSecurityUser);
		});

		afterAll(() => {
			secureUserSpy.mockRestore();
		});

		test('should pass data params to repository', async () => {
			await usersService.update(mockSelect, data);

			expect(userRepository.update).toHaveBeenCalledTimes(1);
			expect(userRepository.update).toHaveBeenCalledWith(mockSelect, data);
		});

		test("shouldn't remove avatar if passed avatar = undefined", async () => {
			await usersService.update(mockSelect, data);

			expect(filesService.toFileSystemPath).toHaveBeenCalledTimes(0);
			expect(filesService.writeFile).toHaveBeenCalledTimes(0);
		});

		test("shouldn't remove avatar if passed avatar and there wasn't one", async () => {
			jest
				.spyOn(usersService, 'getOneInsecure')
				.mockResolvedValueOnce(mockUser);
			await usersService.update(mockSelect, data);

			expect(filesService.toFileSystemPath).toHaveBeenCalledTimes(0);
			expect(filesService.removeFile).toHaveBeenCalledTimes(0);
		});

		test('should call removeFile if avatar passed as null ans there was one', async () => {
			await usersService.update(mockSelect, { ...data, avatar: null, });

			expect(filesService.toFileSystemPath).toHaveBeenCalledTimes(1);
			expect(filesService.toFileSystemPath).toHaveBeenCalledWith(
				mockUserWithAvatar.avatar
			);
			expect(filesService.removeFile).toHaveBeenCalledTimes(1);
			expect(filesService.removeFile).toHaveBeenCalledWith(mockFileSystemPath);
		});

		test('should call removeFile if avatar passed as a file ans there was one', async () => {
			await usersService.update(mockSelect, { ...data, avatar: mockAvatar, });

			expect(filesService.toFileSystemPath).toHaveBeenCalledTimes(1);
			expect(filesService.toFileSystemPath).toHaveBeenCalledWith(
				mockUserWithAvatar.avatar
			);
			expect(filesService.removeFile).toHaveBeenCalledTimes(1);
			expect(filesService.removeFile).toHaveBeenCalledWith(mockFileSystemPath);
		});

		test('should call writeFile if avatar passed', async () => {
			await usersService.update(mockSelect, { ...data, avatar: mockAvatar, });

			expect(filesService.writeFile).toHaveBeenCalledTimes(1);
			expect(filesService.writeFile).toHaveBeenCalledWith(mockAvatar);
			expect(userRepository.update).toHaveBeenCalledWith(mockSelect, {
				...data,
				avatar: mockWritePath,
			});
		});

		test('should return secure user', async () => {
			const result = await usersService.update(mockSelect, data);

			expect(result).toBe(mockSecurityUser);
			expect(secureUserSpy).toHaveBeenCalledTimes(1);
			expect(secureUserSpy).toHaveBeenCalledWith(mockUserWithAvatar);
		});

		test('should throw wrapped error if repository thrown', async () => {
			userRepository.update.mockRejectedValueOnce(error);
			expect(() => usersService.update(mockSelect, data)).rejects.toThrowError(
				error
			);
		});
	});

	describe('remove', () => {
		test('should pass select params to repository', async () => {
			await usersService.remove(mockSelect);

			expect(userRepository.remove).toHaveBeenCalledTimes(1);
			expect(userRepository.remove).toHaveBeenCalledWith(mockSelect);
		});

		test('should return true if there was user', async () => {
			const result = await usersService.remove(mockSelect);

			expect(result).toBeTruthy();
		});

		test('should return false if there was no user', async () => {
			userRepository.remove.mockResolvedValueOnce(null);
			const result = await usersService.remove(mockSelect);

			expect(result).toBeFalsy();
		});

		test('should throw error if repository thrown', async () => {
			userRepository.remove.mockRejectedValueOnce(error);
			expect(() => usersService.remove(mockSelect)).rejects.toThrowError(error);
		});
	});

	describe('secureUser', () => {
		test('should return user without password', () => {
			const secure = UsersService.secureUser(mockUser);

			expect(secure).toEqual(mockSecurityUser);
		});
	});
});
