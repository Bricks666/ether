import {
	createHistoryRouter,
	createRoute,
	createRouterControls,
} from 'atomic-router';

export const routes = {
	auth: {
		login: createRoute(),
		registration: createRoute(),
	},
	settings: {
		user: createRoute(),
		token: createRoute(),
		wallets: createRoute(),
	},
	containers: {
		root: createRoute(),
		container: createRoute<{ id: string }>(),
		myContainers: createRoute(),
	},
	home: createRoute(),
};

export const controls = createRouterControls();

export const router = createHistoryRouter({
	routes: [
		{
			path: '/login',
			route: routes.auth.login,
		},
		{
			path: '/registration',
			route: routes.auth.registration,
		},
		{
			path: '/',
			route: routes.home,
		},
		{
			path: '/containers',
			route: routes.containers.root,
		},
		{
			path: '/containers/my',
			route: routes.containers.myContainers,
		},
		{
			path: '/containers/:id',
			route: routes.containers.container,
		},
		{
			path: '/settings/user',
			route: routes.settings.user,
		},
		{
			path: '/settings/token',
			route: routes.settings.token,
		},
		{
			path: '/settings/wallets',
			route: routes.settings.wallets,
		},
	],
	controls,
});
