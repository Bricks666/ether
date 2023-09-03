import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.home;
export const authorizedRoute = sessionModel.chainAuthorized(currentRoute, {
	otherwise: routes.auth.login.open,
});
