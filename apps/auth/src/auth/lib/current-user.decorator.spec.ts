import { ExecutionContext } from '@nestjs/common';
import { currentUserFactory } from './current-user.decorator';

const mockUser = {
	id: 'id',
};

const mockGerRequest = jest.fn().mockReturnValue({ user: mockUser, });

const mockContext = {
	switchToHttp: () => {
		return {
			getRequest: mockGerRequest,
		};
	},
} as unknown as ExecutionContext;

describe('CurrentUser', () => {
	beforeAll(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	test('should return user', () => {
		const user = currentUserFactory('', mockContext);

		expect(user).toBe(mockUser);
	});

	test('should return null if user not exists', () => {
		mockGerRequest.mockReturnValueOnce({});
		const user = currentUserFactory('', mockContext);

		expect(user).toBeNull();
	});
});
