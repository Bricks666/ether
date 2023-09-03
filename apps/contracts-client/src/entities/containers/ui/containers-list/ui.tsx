/* eslint-disable @typescript-eslint/no-unused-vars */
import { CircularProgress } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';

import { CommonProps } from '@/shared/types';

import styles from './ui.module.css';

export interface ContainersListProps
	extends CommonProps,
		React.PropsWithChildren {
	readonly pending: boolean;
	readonly error: string | null;
}

export const ContainersList: React.FC<ContainersListProps> = (props) => {
	const { children, error, pending, className } = props;

	return (
		<section className={cn(styles.wrapper, className)}>
			{children}
			{pending ? <CircularProgress /> : null}
		</section>
	);
};
