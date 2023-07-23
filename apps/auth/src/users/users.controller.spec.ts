/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';

const mockUser = {
	id: 'uuid',
	login: 'login',
};

const mockAvatar = {} as unknown as Express.Multer.File;

const error = new Error('Mock error');

describe('UsersController', () => {
	let controller: UsersController;
	let service: UsersService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				{
					provide: UsersService,
					useValue: {
						update: jest.fn(async () => null),
					},
				}
			],
			controllers: [UsersController],
		}).compile();

		controller = module.get(UsersController);
		service = module.get(UsersService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('update', () => {
		const updateData = {
			password: 'password',
			username: 'username',
		} as UpdateUserDto;

		test('should call UsersService.update', async () => {
			await controller.update(mockUser, updateData, mockAvatar);

			expect(service.update).toHaveBeenCalledTimes(1);
			expect(service.update).toHaveBeenCalledWith(
				{ id: mockUser.id, },
				{ ...updateData, avatar: mockAvatar, }
			);
		});

		test('should return UsersService.update data', async () => {
			jest.spyOn(service, 'update').mockResolvedValueOnce(mockUser as any);
			const result = await controller.update(mockUser, updateData, mockAvatar);

			expect(result).toBe(mockUser);
		});

		test('should throw error if UsersService.update thrown', async () => {
			jest.spyOn(service, 'update').mockRejectedValueOnce(error);
			expect(() =>
				controller.update(mockUser, updateData, mockAvatar)
			).rejects.toThrowError(error);
		});
	});
});
