import { sample } from 'effector';

import { lastContainersModel } from '@/widgets/containers';

import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.home;
export const authorizedRoute = sessionModel.chainAuthorized(currentRoute, {
	otherwise: routes.auth.login.open,
});

sample({
	clock: authorizedRoute.opened,
	fn: () => ({ count: 5 }),
	target: lastContainersModel.query.start,
});
