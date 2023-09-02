import * as React from 'react';

import { withProviders } from './providers';

import { Pages } from '@/pages';

export const App = withProviders(() => {
	return (
		<React.StrictMode>
			<Pages />
		</React.StrictMode>
	);
});
