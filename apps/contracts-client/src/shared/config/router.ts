import { createHistoryRouter, createRoute } from 'atomic-router';
import { sample } from 'effector';
import { createBrowserHistory } from 'history';
import { appModel } from '../models';

export const routes = {
	login: createRoute(),
	registration: createRoute(),
	token: createRoute(),
	container: createRoute(),
	containers: createRoute(),
};

export const router = createHistoryRouter({
	routes: [
		{
			path: '/login',
			route: routes.login,
		},
	],
});

sample({
	clock: appModel.started,
	fn: () => createBrowserHistory(),
	target: router.setHistory,
});
