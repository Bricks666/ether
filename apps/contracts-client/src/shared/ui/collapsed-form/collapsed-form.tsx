import {
	type CollapseProps,
	IconButton,
	Tooltip,
	Collapse,
} from '@mui/material';
import * as React from 'react';

import { useToggle } from '@/shared/lib';
import type { CommonProps } from '@/shared/types';

export interface CollapsedFormProps extends CommonProps {
	readonly title: string;
	readonly form: React.ReactElement;
	readonly openedIcon: React.ReactElement;
	readonly closedIcon: React.ReactElement;
	readonly openedTitle?: string;
	readonly collapseClassName?: string;
	readonly defaultOpened?: boolean;
	readonly CollapseProps?: CollapseProps;
}

/**
 * @question Maybe should rename?
 */
export const CollapsedForm: React.FC<CollapsedFormProps> = (props) => {
	const {
		closedIcon,
		form,
		openedIcon,
		openedTitle,
		title: commonTitle,
		className,
		collapseClassName,
		defaultOpened,
		CollapseProps,
	} = props;

	const [opened, handlers] = useToggle(defaultOpened);

	const title = opened ? openedTitle ?? commonTitle : commonTitle;

	return (
		<>
			<Tooltip title={title}>
				<IconButton className={className} onClick={handlers.toggle}>
					{opened ? openedIcon : closedIcon}
				</IconButton>
			</Tooltip>
			<Collapse
				className={collapseClassName}
				in={opened}
				mountOnEnter
				unmountOnExit
				{...CollapseProps}>
				{form}
			</Collapse>
		</>
	);
};
