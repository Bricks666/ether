import * as React from 'react';

export const withStyles = (
	Component: React.ComponentType
): React.ComponentType => {
	return () => {
		return <Component />;
	};
};
