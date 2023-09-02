import { routes } from '@/shared/config';
import { sessionModel } from '@/shared/models';

export const currentRoute = routes.login;
export const anonymousRoute = sessionModel.chainAnonymous(currentRoute);
