/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Typography,
} from '@mui/material';
import cn from 'classnames';
import * as React from 'react';

import { Container } from '@/shared/api';
import { formatDate, stringToColor } from '@/shared/lib';
import { CommonProps, Slots } from '@/shared/types';

import styles from './ui.module.css';

export interface TemplateContainerCardProps extends CommonProps, Container {
	readonly slots: Slots<'mainActions' | 'secondaryActions'>;
}

export const TemplateContainerCard: React.FC<TemplateContainerCardProps> = (
	props
) => {
	const { id, isPrivate, createdAt, name, updatedAt, className, slots } = props;

	const type = isPrivate ? 'Приватный' : 'Публичный';

	const wasUpdated = createdAt !== updatedAt;

	const formattedCreateDate = formatDate(createdAt);
	const formattedUpdateDate = wasUpdated ? formatDate(updatedAt) : null;

	const updatedText = formattedUpdateDate ?? 'Отсутствует';

	const hasMainActions = !!slots.mainActions;

	const color = stringToColor(id);

	return (
		<Card className={cn(styles.card, className)}>
			<CardMedia
				className={styles.media}
				sx={{ bgcolor: color }}
				component='div'
			/>
			<CardHeader
				className={styles.header}
				title={name}
				titleTypographyProps={{
					variant: 'h6',
					fontWeight: 500,
					component: 'p',
				}}
				subheader={type}
				subheaderTypographyProps={{
					className: cn(styles.type, { [styles.private]: isPrivate }),
					variant: 'caption',
				}}
				action={slots.secondaryActions}
			/>
			<CardContent>
				<Typography variant='subtitle2' fontWeight={500}>
					Контейнер создан:{' '}
					<Typography variant='inherit' fontWeight={400} component='span'>
						{formattedCreateDate}
					</Typography>
				</Typography>
				<Typography variant='subtitle2' fontWeight={500}>
					Последнее обновление:{' '}
					<Typography variant='inherit' fontWeight={400} component='span'>
						{updatedText}
					</Typography>
				</Typography>
			</CardContent>
			{hasMainActions ? <CardActions>{slots.mainActions}</CardActions> : null}
		</Card>
	);
};
