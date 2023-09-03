import { createQuery } from '@farfetched/core';
import {
	RouteInstance,
	RouteParams,
	RouteParamsAndQuery,
	chainRoute,
} from 'atomic-router';
import {
	Effect,
	Event,
	combine,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector';
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
	filter: equals($status, 'initial'),
	fn: () => 'pending' as const,
	target: $status,
});

sample({
	clock: auth.finished.success,
	fn: () => 'authorized' as const,
	target: $status,
});

sample({
	clock: auth.finished.failure,
	fn: () => 'anonymous' as const,
	target: $status,
});

sample({
	clock: auth.finished.success,
	fn: ({ result }) => result,
	target: $user,
});

interface ChainedParams {
	readonly otherwise?: Event<any> | Effect<any, any>;
}

export const chainAuthorized = <Params extends RouteParams>(
	route: RouteInstance<Params>,
	options?: ChainedParams
): RouteInstance<Params> => {
	const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
	const alreadyAnonymous = createEvent();
	const alreadyAuthorized = createEvent();
	const sessionCheckSuccessful = createEvent();
	const sessionCheckFailure = createEvent();

	const $paramsAndQuery = combine({
		params: route.$params,
		query: route.$query,
	});

	sample({
		clock: sessionCheckStarted,
		filter: equals($status, 'initial'),
		target: auth.start,
	});

	sample({
		clock: sessionCheckStarted,
		source: $paramsAndQuery,
		filter: equals($status, 'anonymous'),
		target: alreadyAnonymous,
	});

	sample({
		clock: sessionCheckStarted,
		source: $paramsAndQuery,
		filter: equals($status, 'authorized'),
		target: alreadyAuthorized,
	});

	sample({
		clock: [alreadyAnonymous, auth.finished.failure],
		source: $paramsAndQuery,
		filter: route.$isOpened,
		target: sessionCheckFailure,
	});

	sample({
		clock: [alreadyAuthorized, auth.finished.success],
		source: $paramsAndQuery,
		filter: route.$isOpened,
		target: sessionCheckSuccessful,
	});

	if (options?.otherwise) {
		sample({
			clock: sessionCheckFailure,
			target: options.otherwise as Event<any>,
		});
	}

	return chainRoute({
		route,
		beforeOpen: sessionCheckStarted,
		openOn: sessionCheckSuccessful,
		cancelOn: sessionCheckFailure,
	});
};

export const chainAnonymous = <Params extends RouteParams>(
	route: RouteInstance<Params>,
	options?: ChainedParams
): RouteInstance<Params> => {
	const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
	const alreadyAnonymous = createEvent();
	const alreadyAuthorized = createEvent();
	const sessionCheckSuccessful = createEvent();
	const sessionCheckFailure = createEvent();

	const $paramsAndQuery = combine({
		params: route.$params,
		query: route.$query,
	});

	sample({
		clock: sessionCheckStarted,
		filter: equals($status, 'initial'),
		target: auth.start,
	});

	sample({
		clock: sessionCheckStarted,
		source: $paramsAndQuery,
		filter: equals($status, 'anonymous'),
		target: alreadyAnonymous,
	});

	sample({
		clock: sessionCheckStarted,
		source: $paramsAndQuery,
		filter: equals($status, 'authorized'),
		target: alreadyAuthorized,
	});

	sample({
		clock: [alreadyAnonymous, auth.finished.failure],
		source: $paramsAndQuery,
		filter: route.$isOpened,
		target: sessionCheckFailure,
	});

	sample({
		clock: [alreadyAuthorized, auth.finished.success],
		source: $paramsAndQuery,
		filter: route.$isOpened,
		target: sessionCheckSuccessful,
	});

	if (options?.otherwise) {
		sample({
			clock: sessionCheckSuccessful,
			filter: route.$isOpened,
			target: options.otherwise as Event<any>,
		});
	}

	return chainRoute({
		route,
		beforeOpen: sessionCheckStarted,
		openOn: sessionCheckFailure,
		cancelOn: sessionCheckSuccessful,
	});
};
