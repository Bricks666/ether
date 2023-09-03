import { useUnit } from 'effector-react';
import * as React from 'react';

import { ContainersList, TemplateContainerCard } from '@/entities/containers';

import { CommonProps } from '@/shared/types';
import { PageBlock } from '@/shared/ui';

import { query } from './model';

export const LastContainers: React.FC<CommonProps> = (props) => {
	const { className } = props;

	const lastContainers = useUnit(query);

	return (
		<PageBlock className={className} title='Последние контейнеры'>
			<ContainersList pending={lastContainers.pending} error={null}>
				{lastContainers.data.map((container) => (
					<TemplateContainerCard {...container} slots={{}} key={container.id} />
				))}
			</ContainersList>
		</PageBlock>
	);
};
