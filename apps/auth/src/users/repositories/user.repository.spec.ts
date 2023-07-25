/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable sonarjs/no-duplicate-string */
import { Test } from '@nestjs/testing';
import { PrismaDatabaseService } from '@bricks-ether/server-utils/nestjs';
import { User } from '../entities';
import { CreateUser, UpdateUser } from '../types';
import { UserRepository } from './user.repository';

const mockUser = {
	id: 'id',
	login: 'login',
} as User;

const mockSelect = { id: 'id', };

const error = new Error('Mock error');

describe('UserRepository', () => {
	let repository: UserRepository;
	let databaseService: jest.MockedObjectDeep<PrismaDatabaseService>;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				UserRepository,
				{
					provide: PrismaDatabaseService,
					useValue: {
						user: {
							findUnique: jest.fn().mockResolvedValue(mockUser),
							create: jest.fn().mockResolvedValue(mockUser),
							update: jest.fn().mockResolvedValue(mockUser),
							delete: jest.fn().mockResolvedValue(mockUser),
						},
					},
				}
			],
		}).compile();

		repository = module.get(UserRepository);
		databaseService = module.get(PrismaDatabaseService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe('getOne', () => {
		test('should pass params to database service', async () => {
			await repository.getOne(mockSelect);

			expect(databaseService.user.findUnique).toHaveBeenCalledTimes(1);
			expect(databaseService.user.findUnique).toHaveBeenCalledWith({
				where: mockSelect,
			});
		});

		test('should return user if exists', async () => {
			const result = await repository.getOne(mockSelect);

			expect(result).toBe(mockUser);
		});

		test('should return null if user not exists', async () => {
			databaseService.user.findUnique.mockResolvedValueOnce(undefined);
			const result = await repository.getOne(mockSelect);

			expect(result).toBeNull();
		});

		test('should throw error if service thrown', async () => {
			databaseService.user.findUnique.mockRejectedValueOnce(error);
			expect(() => repository.getOne(mockSelect)).rejects.toThrowError(error);
		});
	});

	describe('create', () => {
		const data = {
			login: 'login',
		} as CreateUser;

		test('should pass params to database service', async () => {
			await repository.create(data);

			expect(databaseService.user.create).toHaveBeenCalledTimes(1);
			expect(databaseService.user.create).toHaveBeenCalledWith({
				data,
			});
		});

		test('should return user if exists', async () => {
			const result = await repository.create(data);

			expect(result).toBe(mockUser);
		});

		test('should throw error if service thrown', async () => {
			databaseService.user.create.mockRejectedValueOnce(error);
			expect(() => repository.create(data)).rejects.toThrowError(error);
		});
	});

	describe('update', () => {
		const data = {
			login: 'login',
		} as UpdateUser;

		test('should pass params to database service', async () => {
			await repository.update(mockSelect, data);

			expect(databaseService.user.update).toHaveBeenCalledTimes(1);
			expect(databaseService.user.update).toHaveBeenCalledWith({
				where: mockSelect,
				data,
			});
		});

		test('should return user if exists', async () => {
			const result = await repository.update(mockSelect, data);

			expect(result).toBe(mockUser);
		});

		test('should return null if user not exists', async () => {
			databaseService.user.update.mockResolvedValueOnce(undefined);
			const result = await repository.update(mockSelect, data);

			expect(result).toBeNull();
		});

		test('should throw error if service thrown', async () => {
			databaseService.user.update.mockRejectedValueOnce(error);
			expect(() => repository.update(mockSelect, data)).rejects.toThrowError(
				error
			);
		});
	});

	describe('remove', () => {
		test('should pass params to database service', async () => {
			await repository.remove(mockSelect);

			expect(databaseService.user.delete).toHaveBeenCalledTimes(1);
			expect(databaseService.user.delete).toHaveBeenCalledWith({
				where: mockSelect,
			});
		});

		test('should return user if exists', async () => {
			const result = await repository.remove(mockSelect);

			expect(result).toBe(mockUser);
		});

		test('should return null if user not exists', async () => {
			databaseService.user.delete.mockResolvedValueOnce(undefined);
			const result = await repository.remove(mockSelect);

			expect(result).toBeNull();
		});

		test('should throw error if service thrown', async () => {
			databaseService.user.delete.mockRejectedValueOnce(error);
			expect(() => repository.remove(mockSelect)).rejects.toThrowError(error);
		});
	});
});
