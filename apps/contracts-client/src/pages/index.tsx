import { createRoutesView } from 'atomic-router-react';
import * as React from 'react';

import { PageLoader } from '@/shared/ui';

import { loginPage } from './login';
import { registrationPage } from './registration';

const View = createRoutesView({
	routes: [loginPage, registrationPage],
});

export const Pages = () => {
	return (
		<React.Suspense fallback={<PageLoader />}>
			<View />
		</React.Suspense>
	);
};
