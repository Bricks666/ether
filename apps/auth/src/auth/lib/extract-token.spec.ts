import { extractToken } from './extract-token';

const tokenBody = 'body';

describe('extractToken', () => {
	test('should be defined', () => {
		expect(extractToken).toBeDefined();
	});

	test('should return body if everything good', () => {
		const result = extractToken(`Bearer ${tokenBody}`);

		expect(result).toBe(tokenBody);
	});

	test('should return null if invalid type', () => {
		const result1 = extractToken(`BAarer ${tokenBody}`);

		expect(result1).toBeNull();

		const result2 = extractToken(`Token ${tokenBody}`);

		expect(result2).toBeNull();
	});

	test('should return null if there is not body', () => {
		const result = extractToken('Bearer');

		expect(result).toBeNull();
	});

	test('should return null if nothing passed', () => {
		const result = extractToken(undefined);

		expect(result).toBeNull();
	});
});
