import { createQuery, cache } from '@farfetched/core';
import { runtypeContract } from '@farfetched/runtypes';
import { createEffect } from 'effector';
import { Array } from 'runtypes';

import { containersApi, container } from '@/shared/api';

const handlerFx = createEffect(containersApi.getOwned);
export const query = createQuery({
	initialData: [],
	effect: handlerFx,
	contract: runtypeContract(Array(container)),
});

cache(query);
