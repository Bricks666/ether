/* eslint-disable import/no-extraneous-dependencies */
import { Test } from '@nestjs/testing';

import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequiredAuthGuard } from './required-auth.guard';
import { extractToken } from './extract-token';

jest.mock('./extract-token', () => ({
	extractToken: jest.fn(),
}));

const token = 'token';
const extractedToken = 'extracted token';

const mockRequest = {
	headers: {
		authorization: token,
	},
};

const mockUser = {
	id: 1,
	login: 'login',
};

(extractToken as jest.Mock).mockReturnValue(extractedToken);

const mockGetRequest = jest.fn<any, any>(() => ({ ...mockRequest, }));

const error = new Error('Mock error');

const mockContext = {
	switchToHttp: () => {
		return {
			getRequest: mockGetRequest,
		};
	},
} as unknown as ExecutionContext;

describe('RequiredAuthGuard', () => {
	let guard: RequiredAuthGuard;
	let authService: AuthService;

	beforeAll(async () => {
		const module = await Test.createTestingModule({
			providers: [
				RequiredAuthGuard,
				{
					provide: AuthService,
					useValue: {
						extractUser: jest.fn(() => mockUser),
					},
				}
			],
		}).compile();

		guard = module.get(RequiredAuthGuard);
		authService = module.get(AuthService);

		guard.onModuleInit();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('should be defined', () => {
		expect(guard).toBeDefined();
	});

	test('should have canActivate method', () => {
		expect(guard.canActivate).toBeDefined();
	});

	test('should extract token from header', async () => {
		await guard.canActivate(mockContext);

		expect(extractToken).toHaveBeenCalledTimes(1);
		expect(extractToken).toHaveBeenCalledWith(token);
	});

	test('should throw error if there is not authorization headers', async () => {
		(extractToken as jest.Mock).mockReturnValueOnce(null);
		expect(() => guard.canActivate(mockContext)).rejects.toThrowError(
			new BadRequestException('Invalid authorization header')
		);
	});

	test('should call extractUser with extracted token', async () => {
		await guard.canActivate(mockContext);

		expect(authService.extractUser).toHaveBeenCalledTimes(1);
		expect(authService.extractUser).toHaveBeenCalledWith(extractedToken);
	});

	test('should call extractUser with extracted token', async () => {
		await guard.canActivate(mockContext);

		expect(authService.extractUser).toHaveBeenCalledTimes(1);
		expect(authService.extractUser).toHaveBeenCalledWith(extractedToken);
	});

	test('should throw error if extractUser throw', async () => {
		(authService.extractUser as jest.Mock).mockRejectedValueOnce(error);

		expect(() => guard.canActivate(mockContext)).rejects.toThrowError(error);
	});

	test('should set user to request', async () => {
		const mutationRequest: any = { ...mockRequest, };

		mockGetRequest.mockReturnValueOnce(mutationRequest);
		await guard.canActivate(mockContext);

		expect(mutationRequest.user).toBeDefined();
		expect(mutationRequest.user).toBe(mockUser);
	});

	test('should return true', async () => {
		const result = await guard.canActivate(mockContext);

		expect(result).toBeTruthy();
	});
});
