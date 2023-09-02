import { Container } from '@mui/material';
import cn from 'classnames';
import { useUnit } from 'effector-react';
import * as React from 'react';

import { deviceInfoModel } from '@/shared/models';
import { CommonProps } from '@/shared/types';

import { Center } from '../center';

export interface AuthLayoutProps extends CommonProps {}

export const AuthLayout: React.FC<React.PropsWithChildren<AuthLayoutProps>> = (
	props
) => {
	const { className, children } = props;
	const isMobile = useUnit(deviceInfoModel.$isMobile);

	return (
		<Container disableGutters={isMobile}>
			<Center fullHeight>
				<main className={cn(className)}>{children}</main>
			</Center>
		</Container>
	);
};
