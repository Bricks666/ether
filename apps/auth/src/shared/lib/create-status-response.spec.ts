import { createStatusResponse } from './create-status-response';

describe('createStatusResponse', () => {
	beforeAll(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('should return object', () => {
		const response = createStatusResponse({ status: 'status', statusCode: 0, });

		expect(response.status).toBeDefined();
		expect(response.statusCode).toBeDefined();
		expect(response.success).toBeDefined();
	});

	test('should return object with passed params', () => {
		const response = createStatusResponse({ status: 'status', statusCode: 0, });

		expect(response.status).toBe('status');
		expect(response.statusCode).toBe(0);
	});

	test('should have success true if statusCode 0', () => {
		const response = createStatusResponse({ status: 'status', statusCode: 0, });

		expect(response).toBeTruthy();
	});

	test('should have success false if statusCode not 0', () => {
		const response = createStatusResponse({ status: 'status', statusCode: 42, });

		expect(response.success).toBeFalsy();
	});
});
