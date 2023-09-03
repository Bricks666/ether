import { redirect } from 'atomic-router';
import { sample } from 'effector';

import { registrationModel } from '@/features/auth';

import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.auth.registration;
export const anonymousRoute = sessionModel.chainAnonymous(currentRoute, {
	otherwise: routes.home.open,
});

redirect({
	route: routes.auth.login,
	clock: registrationModel.query.finished.success,
});

sample({
	clock: anonymousRoute.closed,
	target: [registrationModel.$error.reinit!, registrationModel.form.reset],
});
