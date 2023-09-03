import { createRoutesView } from 'atomic-router-react';
import * as React from 'react';

import { PageLoader } from '@/shared/ui';

import { homePage } from './home';
import { loginPage } from './login';
import { registrationPage } from './registration';

const View = createRoutesView({
	routes: [loginPage, registrationPage, homePage],
});

export const Pages = () => {
	return (
		<React.Suspense fallback={<PageLoader />}>
			<View />
		</React.Suspense>
	);
};
