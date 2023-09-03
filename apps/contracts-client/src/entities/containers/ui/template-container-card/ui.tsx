/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent } from '@mui/material';
import * as React from 'react';

import { Container } from '@/shared/api';
import { CommonProps } from '@/shared/types';

export interface TemplateContainerCardProps extends CommonProps, Container {}

export const TemplateContainerCard: React.FC<TemplateContainerCardProps> = (
	props
) => {
	const { id, isPrivate, createdAt, name, ownerId, updatedAt, className } =
		props;

	console.log(props);

	return (
		<Card>
			<CardContent>{name}</CardContent>
		</Card>
	);
};
