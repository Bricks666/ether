import { createRoutesView } from 'atomic-router-react';
import * as React from 'react';

import { PageLoader } from '@/shared/ui';

import { loginPage } from './login';


const View = createRoutesView({
	routes: [loginPage],
});

export const Pages = () => {
	return (
		<React.Suspense fallback={<PageLoader />}>
			<View />
		</React.Suspense>
	);
};
