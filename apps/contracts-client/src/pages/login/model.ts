import { sample } from 'effector';

import { loginModel } from '@/features/auth';

import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.auth.login;
export const anonymousRoute = sessionModel.chainAnonymous(currentRoute, {
	otherwise: routes.home.open,
});

sample({
	clock: anonymousRoute.closed,
	target: [loginModel.$error.reinit!, loginModel.form.reset],
});
