/* eslint-disable sonarjs/no-duplicate-string */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Test } from '@nestjs/testing';
import { UsersService } from '@/users/users.service';
import { createStatusResponse } from '@/shared';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponseDto, TokensDto } from './dto';

describe('AuthController', () => {
	let controller: AuthController;
	let authService: AuthService;
	let usersService: UsersService;

	const cookie = {
		value: 'mock token',
		setCookie: jest.fn(),
		clearCookie: jest.fn(),
	};

	const tokens = {
		refreshToken: 'mock token',
	} as TokensDto;

	const authResponse = {
		tokens,
	} as AuthResponseDto;

	const error = new Error('Mock error');

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: {
						getMe: jest.fn(),
						login: jest.fn(),
						registration: jest.fn(),
						refresh: jest.fn(),
					},
				},
				{
					provide: UsersService,
					useValue: {
						getOne: jest.fn(),
					},
				}
			],
		}).compile();

		controller = module.get(AuthController);
		authService = module.get(AuthService);
		usersService = module.get(UsersService);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	test('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('checkToken', () => {
		test('should call UsersService.getOne', async () => {
			jest.spyOn(usersService, 'getOne').mockImplementationOnce(() => null);
			await controller.checkToken({ id: 1, } as any);

			expect(usersService.getOne).toHaveBeenCalledTimes(1);
			expect(usersService.getOne).toHaveBeenCalledWith({ id: 1, });
		});

		test('should return SuccessResponse if there is user', async () => {
			jest.spyOn(usersService, 'getOne').mockImplementationOnce(() => null);
			const result = await controller.checkToken({ id: 1, } as any);

			expect(result).toEqual(
				createStatusResponse({
					status: 'valid',
					statusCode: 0,
				})
			);
		});

		test('should throw error if UsersService.getOne thrown', async () => {
			jest.spyOn(usersService, 'getOne').mockImplementationOnce(() => {
				throw error;
			});

			await expect(async () =>
				controller.checkToken({ id: 1, } as any)
			).rejects.toThrowError(error);
			expect(usersService.getOne).toHaveBeenCalledTimes(1);
			expect(usersService.getOne).toHaveBeenCalledWith({ id: 1, });
		});
	});

	describe('auth', () => {
		test('should call AuthService.getMe with token from cookie', async () => {
			jest.spyOn(authService, 'getMe').mockReturnValueOnce(authResponse as any);
			await controller.auth(cookie);

			expect(authService.getMe).toHaveBeenCalledTimes(1);
			expect(authService.getMe).toHaveBeenCalledWith(cookie.value);
		});

		test('should call setCookie with refreshToken', async () => {
			jest.spyOn(authService, 'getMe').mockReturnValueOnce(authResponse as any);
			await controller.auth(cookie);

			expect(cookie.setCookie).toHaveBeenCalledTimes(1);
			expect(cookie.setCookie).toHaveBeenCalledWith(
				authResponse.tokens.refreshToken
			);
		});

		test('should call return AuthService.getMe result', async () => {
			jest.spyOn(authService, 'getMe').mockReturnValueOnce(authResponse as any);
			const result = await controller.auth(cookie);

			expect(result).toBe(authResponse);
		});

		test('should throw error if AuthService.getMe thrown', async () => {
			jest.spyOn(authService, 'getMe').mockImplementationOnce(async () => {
				throw error;
			});

			await expect(() => controller.auth(cookie)).rejects.toThrowError(error);
		});
	});

	describe('login', () => {
		const loginData = {
			login: 'login',
			password: 'password',
		};

		test('should call AuthService.login with call data', async () => {
			jest
				.spyOn(authService, 'login')
				.mockImplementationOnce(async () => authResponse);
			await controller.login(loginData, cookie);

			expect(authService.login).toHaveBeenCalledTimes(1);
			expect(authService.login).toHaveBeenCalledWith(loginData);
		});

		test('should call setCookie with refreshToken', async () => {
			jest
				.spyOn(authService, 'login')
				.mockImplementationOnce(async () => authResponse);
			await controller.login(loginData, cookie);

			expect(cookie.setCookie).toHaveBeenCalledTimes(1);
			expect(cookie.setCookie).toHaveBeenCalledWith(
				authResponse.tokens.refreshToken
			);
		});

		test('should return result AuthService.login called', async () => {
			jest
				.spyOn(authService, 'login')
				.mockImplementationOnce(async () => authResponse);
			const result = await controller.login(loginData, cookie);

			expect(result).toBe(authResponse);
		});

		test('should throw error if AuthService.login thrown', async () => {
			jest.spyOn(authService, 'login').mockImplementationOnce(async () => {
				throw error;
			});
			expect(() => controller.login(loginData, cookie)).rejects.toThrowError(
				error
			);

			expect(authService.login).toHaveBeenCalledTimes(1);
			expect(authService.login).toHaveBeenCalledWith(loginData);
		});
	});

	describe('registration', () => {
		const registrationData = {
			login: 'login',
			password: 'password',
			username: 'username',
		};

		test('should call AuthService.registration with call data', async () => {
			jest.spyOn(authService, 'registration');
			await controller.registration(registrationData);

			expect(authService.registration).toHaveBeenCalledTimes(1);
			expect(authService.registration).toHaveBeenCalledWith(registrationData);
		});

		test('should call return status response', async () => {
			jest
				.spyOn(authService, 'registration')
				.mockImplementationOnce(async () => true);
			const truthyResult = await controller.registration(registrationData);

			expect(truthyResult).toEqual(
				createStatusResponse({
					status: 'registered',
					statusCode: 0,
				})
			);

			jest
				.spyOn(authService, 'registration')
				.mockImplementationOnce(async () => false);
			const falsyResult = await controller.registration(registrationData);

			expect(falsyResult).toEqual(
				createStatusResponse({
					status: 'error',
					statusCode: 1,
				})
			);
		});

		test('should throw error if AuthService.login thrown', async () => {
			jest
				.spyOn(authService, 'registration')
				.mockImplementationOnce(async () => {
					throw error;
				});
			expect(() =>
				controller.registration(registrationData)
			).rejects.toThrowError(error);

			expect(authService.registration).toHaveBeenCalledTimes(1);
			expect(authService.registration).toHaveBeenCalledWith(registrationData);
		});
	});

	describe('logout', () => {
		test('should call clearCookie', async () => {
			await controller.logout(cookie);

			expect(cookie.clearCookie).toHaveBeenCalledTimes(1);
			expect(cookie.clearCookie).toHaveBeenCalledWith();
		});

		test('should call return status response', async () => {
			const truthyResult = await controller.logout(cookie);

			expect(truthyResult).toEqual(
				createStatusResponse({
					status: 'logout',
					statusCode: 0,
				})
			);
		});
	});

	describe('refresh', () => {
		test('should call AuthService.refresh with token from cookie', async () => {
			jest.spyOn(authService, 'refresh').mockReturnValueOnce(tokens as any);
			await controller.refresh(cookie);

			expect(authService.refresh).toHaveBeenCalledTimes(1);
			expect(authService.refresh).toHaveBeenCalledWith(cookie.value);
		});

		test('should call setCookie with refreshToken', async () => {
			jest.spyOn(authService, 'refresh').mockReturnValueOnce(tokens as any);
			await controller.refresh(cookie);

			expect(cookie.setCookie).toHaveBeenCalledTimes(1);
			expect(cookie.setCookie).toHaveBeenCalledWith(tokens.refreshToken);
		});

		test('should call return AuthService.refresh result', async () => {
			jest.spyOn(authService, 'refresh').mockReturnValueOnce(tokens as any);
			const result = await controller.refresh(cookie);

			expect(result).toBe(tokens);
		});

		test('should throw error if AuthService.refresh thrown', async () => {
			jest.spyOn(authService, 'refresh').mockImplementationOnce(async () => {
				throw error;
			});

			await expect(() => controller.refresh(cookie)).rejects.toThrowError(
				error
			);
		});
	});
});
