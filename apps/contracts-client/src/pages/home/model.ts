import { createQuery } from '@farfetched/core';
import { runtypeContract } from '@farfetched/runtypes';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { not } from 'patronum';
import { Array } from 'runtypes';

import { Container, container, containersApi } from '@/shared/api';
import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.home;
export const authorizedRoute = sessionModel.chainAuthorized(currentRoute, {
	otherwise: routes.auth.login.open,
});

const $page = createStore<number>(0);
const handlerFx = createEffect(containersApi.getAll);
const query = createQuery({
	effect: handlerFx,
	contract: runtypeContract(Array(container)),
});
export const fetchNext = createEvent();
export const $containers = createStore<Container[]>([]);
export const { $pending } = query;

sample({
	clock: fetchNext,
	source: $page,
	filter: not($pending),
	fn: (page) => ({ page: page + 1 }),
	target: query.start,
});

sample({
	clock: query.finished.success,
	source: $containers,
	fn: (containers, { result }) => [...containers, ...result],
	target: $containers,
});

sample({
	clock: query.finished.success,
	source: $page,
	fn: (page) => page + 1,
	target: $page,
});
