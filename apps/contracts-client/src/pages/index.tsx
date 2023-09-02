import * as React from 'react';
import { createRoutesView } from 'atomic-router-react';
import { loginPage } from './login';

const View = createRoutesView({
	routes: [loginPage],
});

export const Pages = () => {
	return (
		<React.Suspense fallback={'loading'}>
			<View />
		</React.Suspense>
	);
};
