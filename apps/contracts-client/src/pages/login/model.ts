import { sample } from 'effector';

import { loginModel } from '@/features/auth';

import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.login;
export const anonymousRoute = sessionModel.chainAnonymous(currentRoute);

sample({
	clock: anonymousRoute.closed,
	target: [loginModel.$error.reinit!, loginModel.form.reset],
});
