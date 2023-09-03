import { Divider, Menu, MenuItem } from '@mui/material';
import { useUnit } from 'effector-react';
import * as React from 'react';

import { routes } from '@/shared/config';
import { CommonProps, VoidFunction } from '@/shared/types';

import { logoutModel } from '../logout';

export interface ShortcutProfileMenuProps extends CommonProps {
	readonly anchorEl: HTMLElement | null;
	readonly opened: boolean;
	readonly onClose: VoidFunction;
	readonly id?: string;
}

export const ShortcutProfileMenu: React.FC<ShortcutProfileMenuProps> = (
	props
) => {
	const { className, anchorEl, opened, onClose, id } = props;
	const logout = useUnit(logoutModel.query);
	const openRoute = useUnit(routes.settings.user.open);

	return (
		<Menu
			className={className}
			id={id}
			open={opened}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}>
			<MenuItem onClick={openRoute}>Настройки</MenuItem>
			<Divider />
			<MenuItem onClick={logout.start}>Выйти</MenuItem>
		</Menu>
	);
};
