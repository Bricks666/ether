import * as React from 'react';
import { RouteRecord, createRouteView } from 'atomic-router-react';
import { anonymousRoute, currentRoute } from './model';

const Page = React.lazy(() => import('./page'));

export const loginPage: RouteRecord<any, any> = {
	route: currentRoute,
	view: createRouteView({
		route: anonymousRoute,
		view: Page,
	}),
};
