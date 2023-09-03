import { RouteRecord, createRouteView } from 'atomic-router-react';
import { lazy } from 'react';

import { PageLoader } from '@/shared/ui';

import { authorizedRoute, currentRoute } from './model';

const Page = lazy(() => import('./page'));

export const homePage: RouteRecord<any, any> = {
	route: currentRoute,
	view: createRouteView({
		view: Page,
		route: authorizedRoute,
		otherwise: PageLoader,
	}),
};
