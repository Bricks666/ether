import { RouteRecord, createRouteView } from 'atomic-router-react';
import * as React from 'react';

import { PageLoader } from '@/shared/ui';

import { anonymousRoute, currentRoute } from './model';

const Page = React.lazy(() => import('./page'));

export const registrationPage: RouteRecord<any, any> = {
	route: currentRoute,
	view: createRouteView({
		route: anonymousRoute,
		view: Page,
		otherwise: PageLoader,
	}),
};
