import * as React from 'react';

import { Header } from '@/widgets/app';
import { LastContainers } from '@/widgets/containers';

import { useTitle } from '@/shared/lib';
import { MainLayout } from '@/shared/ui';

const Page: React.FC = () => {
	useTitle('Домашняя страница');

	return (
		<MainLayout header={<Header />}>
			<LastContainers />
		</MainLayout>
	);
};

export default Page;
