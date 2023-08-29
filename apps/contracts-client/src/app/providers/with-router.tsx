/* eslint-disable no-undef */
import { VoidComponent } from 'solid-js';
import { RouterProvider } from 'atomic-router-solid';

export const withRouter = (Component: VoidComponent): VoidComponent => {
	return () => {
		return (
			<RouterProvider router={router}>
				<Component />
			</RouterProvider>
		);
	};
};
