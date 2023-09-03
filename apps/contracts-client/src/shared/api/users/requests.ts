import { User } from '../auth';
import { coreApi } from '../core';

import { UpdateUserParams } from './types';

const url = 'contracts/users';

export const update = (params: UpdateUserParams): Promise<User> => {
	const body = new FormData();

	body.append('username', params.username);

	if (params.avatar) {
		body.append('avatar', params.avatar);
	}

	return coreApi.request(`${url}/update`).json();
};
