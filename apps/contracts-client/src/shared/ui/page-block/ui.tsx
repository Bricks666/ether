import { Typography } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';

import { CommonProps, Slots } from '@/shared/types';

import styles from './ui.module.css';

export interface PageBlockProps extends CommonProps, React.PropsWithChildren {
	readonly title: string;
	readonly slots?: Slots<'action'>;
}

export const PageBlock: React.FC<PageBlockProps> = (props) => {
	const { title, children, className, slots = {} } = props;

	return (
		<section className={cn(styles.container, className)}>
			<div className={styles.header}>
				<Typography variant='h5' fontWeight={500} component='h2'>
					{title}
				</Typography>
				<div>{slots.action}</div>
			</div>
			<div className={styles.content}>{children}</div>
		</section>
	);
};
