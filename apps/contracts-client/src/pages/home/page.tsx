import { useUnit } from 'effector-react';
import * as React from 'react';

import { Header } from '@/widgets/app';

import { ContainersList, TemplateContainerCard } from '@/entities/containers';

import { useIntersection, useTitle } from '@/shared/lib';
import { MainLayout } from '@/shared/ui';

import { $containers, $pending, fetchNext } from './model';

const Page: React.FC = () => {
	useTitle('Домашняя страница');

	return (
		<MainLayout header={<Header />}>
			<Containers />
		</MainLayout>
	);
};

const Containers: React.FC = () => {
	const [pending, data, next] = useUnit([$pending, $containers, fetchNext]);
	const ref = React.useRef<HTMLDivElement | null>(null);

	const intersection = useIntersection(ref, { rootMargin: '100px' });

	React.useEffect(() => {
		if (intersection?.isIntersecting) {
			next();
		}
	}, [intersection?.isIntersecting]);

	return (
		<ContainersList pending={pending} error={null}>
			{data.map((container) => (
				<TemplateContainerCard {...container} key={container.id} />
			))}
			<div ref={ref} />
		</ContainersList>
	);
};

export default Page;
