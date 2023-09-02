import { redirect } from 'atomic-router';
import { sample } from 'effector';

import { registrationModel } from '@/features/auth';

import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.registration;
export const anonymousRoute = sessionModel.chainAnonymous(currentRoute);

redirect({
	route: routes.login,
	clock: registrationModel.query.finished.success,
});

sample({
	clock: anonymousRoute.closed,
	target: [registrationModel.$error.reinit!, registrationModel.form.reset],
});
