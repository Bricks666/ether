/* eslint-disable import/no-extraneous-dependencies */
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { extractToken } from './lib';
import { LoginDto, RegistrationDto, TokensDto } from './dto';

const token = 'Bearer token';

const extractedToken = 'token';
const hashedPassword = 'hashedPassword';

jest.mock('./lib', () => ({
	extractToken: jest.fn(),
}));

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(() => true),
}));

(extractToken as jest.Mock).mockImplementation(() => extractedToken);
(hash as jest.Mock).mockImplementation(() => hashedPassword);

const mockUser = { id: 1, login: 'login', };
const mockInsecureUser = { ...mockUser, password: 'password', };

const tokens = {} as TokensDto;

const error = new Error('Mock error');

describe('AuthService', () => {
	let authService: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						getOne: jest.fn(async () => mockUser),
						getOneInsecure: jest.fn(async () => mockInsecureUser),
						create: jest.fn(async () => mockUser),
					},
				},
				{
					provide: JwtService,
					useValue: {
						verifyAsync: jest.fn(),
						signAsync: jest.fn(),
					},
				}
			],
		}).compile();

		(extractToken as jest.Mock).mockImplementation(() => extractedToken);

		authService = module.get(AuthService);
		usersService = module.get(UsersService);
		jwtService = module.get(JwtService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should be defined', () => {
		expect(authService).toBeDefined();
	});

	describe('getMe', () => {
		let spyExtractUser: jest.MockInstance<any, any>;
		let spyGenerateTokens: jest.MockInstance<any, any>;

		beforeAll(() => {
			spyExtractUser = jest
				.spyOn<any, any>(authService, 'extractUser')
				.mockReturnValue(mockUser);

			spyGenerateTokens = jest
				.spyOn<any, any>(authService, 'generateTokens')
				.mockReturnValue(tokens);
		});

		afterAll(() => {
			spyExtractUser.mockRestore();
			spyGenerateTokens.mockRestore();
		});

		test('should call AuthService.extractUser with token', async () => {
			await authService.getMe(token);

			expect(authService.extractUser).toHaveBeenCalledTimes(1);
			expect(authService.extractUser).toHaveBeenCalledWith(token);
		});

		test('should throw error if AuthService.extractUser thrown', async () => {
			spyExtractUser.mockImplementationOnce(async () => {
				throw error;
			});

			expect(() => authService.getMe(token)).rejects.toThrowError(error);
		});

		test('should call UsersService.getOne with id from AuthService.extractUser', async () => {
			await authService.getMe(token);

			expect(usersService.getOne).toHaveBeenCalledTimes(1);
			expect(usersService.getOne).toHaveBeenCalledWith({ id: mockUser.id, });
		});

		test('should throw error if UsersService.getOne thrown', async () => {
			jest.spyOn(usersService, 'getOne').mockImplementationOnce(async () => {
				throw error;
			});
			expect(() => authService.getMe(token)).rejects.toThrowError(error);
		});

		test('should call AuthService.generateTokens with user from UsersService.getOne', async () => {
			await authService.getMe(token);

			expect(authService.generateTokens).toHaveBeenCalledTimes(1);
			expect(authService.generateTokens).toHaveBeenCalledWith({
				id: mockUser.id,
				login: mockUser.login,
			});
		});

		test('should throw error if AuthService.generateTokens thrown', async () => {
			spyGenerateTokens.mockImplementationOnce(async () => {
				throw error;
			});

			expect(() => authService.getMe(token)).rejects.toThrowError(error);
		});

		test('should return data from UsersService.getOne and AuthService.generateTokens', async () => {
			const result = await authService.getMe(token);

			expect(result).toEqual({ user: mockUser, tokens, });
		});
	});

	describe('login', () => {
		const loginData = {
			login: 'login',
			password: 'password',
		} as LoginDto;
		let spyGenerateTokens: jest.MockInstance<any, any>;

		beforeAll(() => {
			spyGenerateTokens = jest
				.spyOn<any, any>(authService, 'generateTokens')
				.mockReturnValue(tokens);
		});

		afterAll(() => {
			spyGenerateTokens.mockRestore();
		});

		test('should call UsersService.getOneInsecure with passed login', async () => {
			await authService.login(loginData);

			expect(usersService.getOneInsecure).toHaveBeenCalledTimes(1);
			expect(usersService.getOneInsecure).toHaveBeenCalledWith({
				login: loginData.login,
			});
		});

		test('should throw if UsersService.getOneInsecure thrown', async () => {
			jest
				.spyOn(usersService, 'getOneInsecure')
				.mockImplementationOnce(async () => {
					throw error;
				});
			expect(() => authService.login(loginData)).rejects.toThrowError(error);

			expect(usersService.getOneInsecure).toHaveBeenCalledTimes(1);
			expect(usersService.getOneInsecure).toHaveBeenCalledWith({
				login: loginData.login,
			});
		});

		test('should compare password', async () => {
			await authService.login(loginData);

			expect(compare).toHaveBeenCalledTimes(1);
			expect(compare).toHaveBeenCalledWith(
				loginData.password,
				mockInsecureUser.password
			);
		});

		test('should throw if passwords not compared', async () => {
			(compare as jest.Mock).mockReturnValueOnce(false);
			expect(() => authService.login(loginData)).rejects.toThrowError(
				new ForbiddenException('Invalid password')
			);

			expect(usersService.getOneInsecure).toHaveBeenCalledTimes(1);
			expect(usersService.getOneInsecure).toHaveBeenCalledWith({
				login: loginData.login,
			});
		});

		test('should call AuthService.generateTokens with insecure user data', async () => {
			await authService.login(loginData);

			expect(spyGenerateTokens).toHaveBeenCalledTimes(1);
			expect(spyGenerateTokens).toHaveBeenCalledWith({
				id: mockInsecureUser.id,
				login: mockInsecureUser.login,
			});
		});

		test('should throw if passwords not compared', async () => {
			spyGenerateTokens.mockRejectedValueOnce(error);
			expect(() => authService.login(loginData)).rejects.toThrowError(error);

			expect(usersService.getOneInsecure).toHaveBeenCalledTimes(1);
			expect(usersService.getOneInsecure).toHaveBeenCalledWith({
				login: loginData.login,
			});
		});

		test('should return tokens and user', async () => {
			const result = await authService.login(loginData);
			expect(result).toEqual({
				user: mockUser,
				tokens,
			});
		});
	});

	describe('registration', () => {
		const registrationData = {
			login: 'login',
			password: 'password',
			username: 'username',
		} as RegistrationDto;

		test('should hash password', async () => {
			await authService.registration(registrationData);

			expect(hash).toHaveBeenCalledTimes(1);
			expect(hash).toHaveBeenCalledWith(
				registrationData.password,
				Number(process.env.ROUND)
			);
		});

		test('should call UsersService.create', async () => {
			await authService.registration(registrationData);

			expect(usersService.create).toHaveBeenCalledTimes(1);
			expect(usersService.create).toHaveBeenCalledWith({
				...registrationData,
				password: hashedPassword,
			});
		});

		test('should return true if registered success', async () => {
			const result = await authService.registration(registrationData);

			expect(result).toBeTruthy();
		});

		test('should throw error if UsersService.create thrown', async () => {
			(usersService.create as jest.Mock).mockRejectedValueOnce(error);
			expect(() =>
				authService.registration(registrationData)
			).rejects.toThrowError(error);
		});
	});

	describe('refresh', () => {
		let spyExtractUser: jest.MockInstance<any, any>;
		let spyGenerateTokens: jest.MockInstance<any, any>;

		beforeAll(() => {
			spyExtractUser = jest
				.spyOn<any, any>(authService, 'extractUser')
				.mockResolvedValue(mockUser);

			spyGenerateTokens = jest
				.spyOn<any, any>(authService, 'generateTokens')
				.mockResolvedValue(tokens);
		});

		afterAll(() => {
			spyExtractUser.mockRestore();
			spyGenerateTokens.mockRestore();
		});

		test('should call AuthService.extractUser with passed token', async () => {
			await authService.refresh(token);

			expect(spyExtractUser).toHaveBeenCalledTimes(1);
			expect(spyExtractUser).toHaveBeenCalledWith(token);
		});

		test('should call AuthService.generateTokens with extracted user data', async () => {
			await authService.refresh(token);

			expect(spyGenerateTokens).toHaveBeenCalledTimes(1);
			expect(spyGenerateTokens).toHaveBeenCalledWith(mockUser);
		});

		test('should return tokens', async () => {
			const result = await authService.refresh(token);

			expect(result).toEqual(tokens);
		});

		test('should throw wrapped error if AuthService.extractUser thrown', async () => {
			spyExtractUser.mockRejectedValueOnce(error);
			expect(() => authService.refresh(token)).rejects.toThrowError(
				new ForbiddenException('Invalid token', { cause: error, })
			);
		});

		test('should throw error if AuthService.generateTokens thrown', async () => {
			spyGenerateTokens.mockRejectedValueOnce(error);
			expect(() => authService.refresh(token)).rejects.toThrowError(error);
		});
	});

	describe('extractUser', () => {
		let spyVerify: jest.MockInstance<any, any>;

		beforeAll(() => {
			spyVerify = jest
				.spyOn(jwtService, 'verifyAsync')
				.mockImplementation(async () => {
					return null;
				});
		});

		afterAll(() => {
			spyVerify.mockRestore();
		});

		test('should call jwtService.verifyAsync with passed token', async () => {
			await authService.extractUser(token);

			expect(spyVerify).toHaveBeenCalledTimes(1);
			expect(spyVerify).toHaveBeenCalledWith(token);
		});

		test('should return jwtService.verifyAsync result', async () => {
			spyVerify.mockResolvedValueOnce(mockUser);
			const result = await authService.extractUser(token);

			expect(result).toBe(mockUser);
		});

		test('should throw wrapped error if jwtService.verifyAsync thrown', async () => {
			spyVerify.mockRejectedValueOnce(error);

			expect(async () => authService.extractUser(token)).rejects.toThrowError(
				new UnauthorizedException('Invalid token', { cause: error, })
			);
		});
	});

	describe('generateTokens', () => {
		let spySign: jest.MockInstance<any, any>;

		beforeAll(() => {
			spySign = jest
				.spyOn(jwtService, 'signAsync')
				.mockImplementation(async () => extractedToken);
		});

		afterAll(() => {
			spySign.mockRestore();
		});

		test('should generate two tokens', async () => {
			await authService.generateTokens(mockUser as any);

			expect(spySign).toHaveBeenCalledTimes(2);
			expect(spySign).toHaveBeenNthCalledWith(1, mockUser, {
				expiresIn: '15min',
			});
			expect(spySign).toHaveBeenNthCalledWith(2, mockUser, {
				expiresIn: '30d',
			});
		});

		test('should return generated tokens', async () => {
			const result = await authService.generateTokens(mockUser as any);

			expect(result).toEqual({
				accessToken: extractedToken,
				refreshToken: extractedToken,
			});
		});

		test('should throw error if at least one of generation rejected', async () => {
			spySign
				.mockResolvedValueOnce(extractedToken)
				.mockRejectedValueOnce(error);
			expect(() =>
				authService.generateTokens(mockUser as any)
			).rejects.toThrowError(error);
		});
	});
});
