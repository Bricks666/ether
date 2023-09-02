import {
	StyledEngineProvider,
	Experimental_CssVarsProvider as CssVarsProvider,
	experimental_extendTheme as extendTheme,
} from '@mui/material';
import * as React from 'react';

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
	},
});
