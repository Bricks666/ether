/* eslint-disable no-undef */
import { redirect } from 'atomic-router';
import { RouterProvider } from 'atomic-router-react';
import * as React from 'react';

import { router, routes } from '@/shared/config';

redirect({
	clock: router.routeNotFound,
	route: routes.auth.login,
});

export const withRouter = (
	Component: React.ComponentType
): React.ComponentType => {
	return () => {
		return (
			<RouterProvider router={router}>
				<Component />
			</RouterProvider>
		);
	};
};
