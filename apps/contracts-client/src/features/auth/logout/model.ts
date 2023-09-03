import { createMutation } from '@farfetched/core';
import { runtypeContract } from '@farfetched/runtypes';
import { createEffect, sample } from 'effector';

import { authApi, statusResponse } from '@/shared/api';
import { sessionModel } from '@/shared/models';

const handlerFx = createEffect(authApi.logout);

export const query = createMutation({
	effect: handlerFx,
	contract: runtypeContract(statusResponse),
});

sample({
	clock: query.finished.success,
	target: sessionModel.auth.start,
});
