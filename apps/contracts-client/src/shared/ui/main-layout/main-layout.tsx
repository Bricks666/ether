import { Container } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';

import { CommonProps } from '@/shared/types';

import styles from './main-layout.module.css';

export interface MainLayoutProps extends CommonProps {
	readonly header: React.ReactElement;
}

export const MainLayout: React.FC<React.PropsWithChildren<MainLayoutProps>> = (
	props
) => {
	const { className, children, header } = props;

	return (
		<div className={styles.container}>
			{header}
			<Container className={cn(styles.main, className)} component='main'>
				{children}
			</Container>
		</div>
	);
};
