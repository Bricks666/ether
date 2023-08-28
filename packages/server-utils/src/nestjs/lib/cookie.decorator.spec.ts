import { ExecutionContext } from '@nestjs/common';
import { cookieFactory, BASE_COOKIE_OPTIONS } from './cookie.decorator';

const cookieName = 'cookie-name';
const otherCookieName = 'other-cookie-name';

const cookieValue = 'cookie-value';
const newCookieValue = 'new-cookie-value';

const mockRequest = {
	cookies: {
		[cookieName]: cookieValue,
	},
};
const mockSetCookie = jest.fn();
const mockClearCookie = jest.fn();

const context = {
	switchToHttp: () => {
		return {
			getRequest: () => {
				return mockRequest;
			},
			getResponse: () => {
				return {
					cookie: mockSetCookie,
					clearCookie: mockClearCookie,
				};
			},
		};
	},
} as ExecutionContext;

describe('Cookie', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('should return object', () => {
		const result = cookieFactory(cookieName, context);

		expect(result.value).toBeDefined();
		expect(result.setCookie).toBeDefined();
		expect(result.clearCookie).toBeDefined();
	});

	test('should return value when exists', () => {
		const result = cookieFactory(cookieName, context);

		expect(result.value).toBe(cookieValue);
	});

	test('should return null if cookie not exists', () => {
		const result = cookieFactory(otherCookieName, context);

		expect(result.value).toBeNull();
	});

	test('should call set cookie with passed value', () => {
		const result = cookieFactory(cookieName, context);
		result.setCookie(newCookieValue);

		expect(mockSetCookie).toHaveBeenCalledTimes(1);
		expect(mockSetCookie).toHaveBeenCalledWith(
			cookieName,
			newCookieValue,
			BASE_COOKIE_OPTIONS
		);
	});

	test('should override options when passed', () => {
		const result = cookieFactory(cookieName, context);
		result.setCookie(newCookieValue, { httpOnly: false, });

		expect(mockSetCookie).toHaveBeenCalledTimes(1);
		expect(mockSetCookie).toHaveBeenCalledWith(cookieName, newCookieValue, {
			...BASE_COOKIE_OPTIONS,
			httpOnly: false,
		});
	});

	test('should call clear cookie', () => {
		const result = cookieFactory(cookieName, context);
		result.clearCookie();

		expect(mockClearCookie).toHaveBeenCalledTimes(1);
		expect(mockClearCookie).toHaveBeenCalledWith(cookieName);
	});
});
