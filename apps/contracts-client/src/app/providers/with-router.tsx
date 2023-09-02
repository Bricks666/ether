/* eslint-disable no-undef */
import * as React from 'react';
import { RouterProvider } from 'atomic-router-react';
import { redirect } from 'atomic-router';
import { router, routes } from '@/shared/config';

redirect({
	clock: router.routeNotFound,
	route: routes.login,
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
