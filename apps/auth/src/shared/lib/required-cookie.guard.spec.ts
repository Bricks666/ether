/* eslint-disable dot-notation */
import { ExecutionContext } from '@nestjs/common';
import { RequiredCookieGuard } from './required-cookie.guard';

const name = 'cookie name';

const mockCookieValue = 'mock value';

const mockGetRequest = jest.fn<any, any>(() => ({
	cookies: { [name]: mockCookieValue, },
}));

const mockContext = {
	switchToHttp: () => {
		return {
			getRequest: mockGetRequest,
		};
	},
} as unknown as ExecutionContext;

describe('RequiredCookieGuard', () => {
	let guard: RequiredCookieGuard;

	beforeAll(() => {
		guard = new RequiredCookieGuard(name);
	});

	afterAll(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	test('should be defined', () => {
		expect(guard).toBeDefined();
	});

	test('should have canActivate method', () => {
		expect(guard.canActivate).toBeDefined();
	});

	test('should have passed name', () => {
		expect(guard['name']).toBe(name);
	});

	test('should have allowEmpty false by default', () => {
		expect(guard['allowEmpty']).toBeFalsy();
	});

	test('should return true when there is value', () => {
		const value = guard.canActivate(mockContext);

		expect(value).toBeTruthy();
	});

	test('should return false when there is not value', () => {
		mockGetRequest.mockReturnValueOnce({ cookies: {}, });
		const value = guard.canActivate(mockContext);

		expect(value).toBeFalsy();
	});

	describe('with allowEmpty false', () => {
		beforeAll(() => {
			guard = new RequiredCookieGuard(name, false);
		});

		test('should have passed allowEmpty false', () => {
			expect(guard['allowEmpty']).toBeFalsy();
		});

		test('should return false when there is empty value', () => {
			mockGetRequest.mockReturnValueOnce({ cookies: { [name]: '', }, });

			const value = guard.canActivate(mockContext);

			expect(value).toBeFalsy();
		});
	});

	describe('with allowEmpty true', () => {
		beforeAll(() => {
			guard = new RequiredCookieGuard(name, true);
		});

		test('should have passed allowEmpty false', () => {
			expect(guard['allowEmpty']).toBeTruthy();
		});

		test('should return true when there is empty value', () => {
			mockGetRequest.mockReturnValueOnce({ cookies: { [name]: '', }, });

			const value = guard.canActivate(mockContext);

			expect(value).toBeTruthy();
		});
	});
});
