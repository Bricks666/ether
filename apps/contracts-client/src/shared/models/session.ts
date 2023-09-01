import {
	Effect,
	Event,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector';
import { createQuery } from '@farfetched/core';
import {
	RouteInstance,
	RouteParams,
	RouteParamsAndQuery,
	chainRoute,
} from 'atomic-router';
import { equals } from 'patronum';

import { User, authApi } from '../api';

type Status = 'initial' | 'pending' | 'authorized' | 'anonymous';

export const $user = createStore<User | null>(null);
export const $status = createStore<Status>('initial');
export const $isAuth = $status.map((status) => status === 'authorized');

const handlerFx = createEffect(authApi.auth);

export const auth = createQuery({
	effect: handlerFx,
	mapData: ({ result }) => result.user,
});

sample({
	clock: auth.start,
	fn: () => 'pending' as const,
	target: $status,
});

sample({
	clock: auth.finished.success,
	filter: equals(auth.$status, 'done'),
	fn: () => 'authorized' as const,
	target: $status,
});

sample({
	clock: auth.finished.failure,
	fn: () => 'anonymous' as const,
	target: $status,
});

interface ChainedParams {
	readonly otherwise?: Event<any> | Effect<any, any>;
}

export const chainAuthorized = <Params extends RouteParams>(
	route: RouteInstance<Params>,
	options?: ChainedParams
): RouteInstance<Params> => {
	const checkAuthorized = createEvent<RouteParamsAndQuery<Params>>();
	const authorizedSuccess = createEvent();
	const authorizedUnsuccess = createEvent();

	sample({
		clock: checkAuthorized,
		filter: equals($status, 'initial'),
		target: auth.start,
	});

	sample({
		clock: auth.finished.failure,
		target: authorizedUnsuccess,
	});

	sample({
		clock: auth.finished.success,
		target: authorizedSuccess,
	});

	sample({
		clock: $user,
		filter: Boolean,
		target: authorizedSuccess,
	});

	sample({
		clock: checkAuthorized,
		filter: equals($status, 'authorized'),
		target: authorizedUnsuccess,
	});

	sample({
		clock: checkAuthorized,
		filter: equals($status, 'anonymous'),
		target: authorizedUnsuccess,
	});

	if (options?.otherwise) {
		sample({
			clock: authorizedUnsuccess,
			target: options?.otherwise as Event<any>,
		});
	}

	return chainRoute({
		route,
		beforeOpen: checkAuthorized,
		openOn: authorizedSuccess,
		cancelOn: authorizedUnsuccess,
	});
};

export const chainAnonymous = <Params extends RouteParams>(
	route: RouteInstance<Params>,
	options?: ChainedParams
): RouteInstance<Params> => {
	const checkAuthorized = createEvent<RouteParamsAndQuery<Params>>();
	const authorizedSuccess = createEvent();
	const authorizedUnsuccess = createEvent();

	sample({
		clock: checkAuthorized,
		filter: equals($status, 'initial'),
		target: auth.start,
	});

	sample({
		clock: auth.finished.failure,
		target: authorizedUnsuccess,
	});

	sample({
		clock: auth.finished.success,
		target: authorizedSuccess,
	});

	sample({
		clock: $user,
		filter: Boolean,
		target: authorizedSuccess,
	});

	sample({
		clock: checkAuthorized,
		filter: equals($status, 'anonymous'),
		target: authorizedUnsuccess,
	});

	sample({
		clock: checkAuthorized,
		filter: equals($status, 'authorized'),
		target: authorizedUnsuccess,
	});

	if (options?.otherwise) {
		sample({
			clock: authorizedSuccess,
			target: options?.otherwise as Event<any>,
		});
	}

	return chainRoute({
		route,
		beforeOpen: checkAuthorized,
		openOn: authorizedUnsuccess,
		cancelOn: authorizedSuccess,
	});
};
