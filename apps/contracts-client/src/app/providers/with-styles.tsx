import { VoidComponent } from 'solid-js';
import { StyledEngineProvider } from '@suid/material';

export const withStyles = (Component: VoidComponent): VoidComponent => {
	return () => {
		return (
			<StyledEngineProvider injectFirst>
				<Component />
			</StyledEngineProvider>
		);
	};
};
