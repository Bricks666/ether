import { AppBar, Avatar, IconButton, Toolbar, Tooltip } from '@mui/material';
import { useUnit } from 'effector-react';
import * as React from 'react';

import { ShortcutProfileMenu } from '@/features/auth';

import { stringToColor, useToggle } from '@/shared/lib';
import { sessionModel } from '@/shared/models';
import { Logo } from '@/shared/ui';

import styles from './ui.module.css';

export const Header: React.FC = () => {
	const isAuth = useUnit(sessionModel.$isAuth);

	return (
		<AppBar position='static'>
			<Toolbar>
				<Logo />
				{isAuth ? <UserAvatar /> : null}
			</Toolbar>
		</AppBar>
	);
};

const UserAvatar: React.FC = () => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const user = useUnit(sessionModel.$user);

	const [opened, handlers] = useToggle();

	if (!user) {
		return null;
	}

	const { avatar, username } = user;

	const color = stringToColor(username);
	const src = avatar ?? '';

	const title = opened ? 'Закрыть быстрое меню' : 'Открыть быстрое меню';

	return (
		<>
			<Tooltip title={title}>
				<IconButton
					className={styles.avatar}
					onClick={handlers.toggle}
					ref={setAnchorEl}>
					<Avatar src={src} sx={{ bgcolor: color }}></Avatar>
				</IconButton>
			</Tooltip>
			<ShortcutProfileMenu
				anchorEl={anchorEl}
				opened={opened}
				onClose={handlers.toggleOff}
			/>
		</>
	);
};
