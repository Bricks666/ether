import { SvgIcon, SvgIconProps } from '@mui/material';
import cn from 'classnames';
import * as React from 'react';

import styles from './ui.module.css';

export const Logo: React.FC<SvgIconProps> = (props) => {
	const { className, ...rest } = props;

	return (
		<SvgIcon
			className={cn(styles.logo, className)}
			viewBox='0 0 108.81 39.54'
			{...rest}>
			<path
				className={styles.container}
				d='M70.56 21.07v1.65q-.79-.74-1.69-1.1-.89-.37-1.9-.37-1.98 0-3.04 1.22-1.05 1.2-1.05 3.5 0 2.29 1.05 3.5Q65 30.7 66.97 30.7q1.01 0 1.9-.37.9-.36 1.7-1.1v1.64q-.83.55-1.75.83-.92.28-1.94.28-2.63 0-4.14-1.6-1.51-1.61-1.51-4.4t1.51-4.4q1.51-1.6 4.14-1.6 1.04 0 1.95.27.93.28 1.73.83zm7.12.17q-1.7 0-2.72 1.27-1 1.27-1 3.46t1 3.46q1.01 1.27 2.72 1.27 1.7 0 2.7-1.27 1-1.27 1-3.46 0-2.2-1-3.46-1-1.27-2.7-1.27zm0-1.27q2.43 0 3.89 1.63t1.46 4.37q0 2.74-1.46 4.37t-3.9 1.63q-2.43 0-3.9-1.63-1.46-1.62-1.46-4.37 0-2.74 1.46-4.37 1.47-1.63 3.9-1.63zm7.8.2h2.1l5.13 9.69v-9.68h1.52v11.57h-2.1l-5.14-9.68v9.68h-1.51zm10.27 0h9.79v1.32h-4.11v10.26h-1.58V21.49h-4.1zm13.93 1.55-2.12 5.76h4.25zm-.88-1.54h1.77l4.41 11.57h-1.62l-1.06-2.97h-5.21l-1.06 2.97h-1.65zm7.87 0h1.57v11.57h-1.57zm4.69 0h2.1l5.14 9.68v-9.68h1.52v11.57H128l-5.13-9.68v9.68h-1.52zm11.87 0h7.32v1.31h-5.75v3.43h5.5v1.32h-5.5v4.19h5.89v1.32h-7.46zm15.52 6.14q.5.17.98.73.48.56.96 1.54l1.59 3.16h-1.68l-1.49-2.97q-.57-1.16-1.11-1.54-.54-.38-1.47-.38h-1.7v4.89h-1.57V20.18h3.54q1.98 0 2.96.82.97.83.97 2.5 0 1.1-.5 1.82-.51.72-1.48 1zm-3.92-4.86v4.11h1.97q1.13 0 1.7-.52.58-.53.58-1.54 0-1.02-.58-1.53-.57-.52-1.7-.52z'
				aria-label='CONTAINER'
				transform='translate(-61.23 7.57)'
			/>
			<path
				className={styles.it}
				d='M161.19 12.7h1.56v11.58h-1.56zm3.07 0h9.8v1.33h-4.11v10.25h-1.58V14.03h-4.1z'
				aria-label='IT'
				transform='matrix(.7654 0 0 .7654 -27.21 12.19)'
			/>
			<path
				className={styles.line}
				d='M156.85 8.42h20.16v20.16h-20.16z'
				transform='matrix(.7654 0 0 .7654 -27.21 12.19)'
			/>
			<path
				className={styles.circular}
				d='m156.83 7.99 10.1-10.02L177.23 8'
				transform='matrix(.7654 0 0 .7654 -27.21 12.19)'
			/>
			<path
				className={styles.box}
				d='m161.81 3.84.04-9.94'
				transform='translate(-61.18 6.63)'
			/>
		</SvgIcon>
	);
};
