import {
	StyledEngineProvider,
	Experimental_CssVarsProvider as CssVarsProvider,
	experimental_extendTheme as extendTheme,
} from '@mui/material';
import * as React from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const withStyles = (
	Component: React.ComponentType
): React.ComponentType => {
	return () => {
		return (
			<StyledEngineProvider injectFirst>
				<CssVarsProvider theme={theme}>
					<Component />
				</CssVarsProvider>
			</StyledEngineProvider>
		);
	};
};

const theme = extendTheme({
	components: {
		MuiPaper: {
			defaultProps: {
				variant: 'outlined',
				elevation: 0,
			},
		},
		MuiButton: {
			defaultProps: {
				variant: 'contained',
				disableElevation: true,
			},
		},

		MuiCard: {
			defaultProps: {
				sx: {
					borderWidth: '2px',
				},
			},
		},
		MuiAppBar: {
			defaultProps: {
				color: 'default',
				sx: {
					borderWidth: '2px',
				},
			},
		},
	},
});
