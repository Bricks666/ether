import { Card, CardContent, Typography, Link as MUILink } from '@mui/material';
import { Link } from 'atomic-router-react';
import * as React from 'react';

import { Header } from '@/widgets/app';

import { LoginForm } from '@/features/auth';

import { routes } from '@/shared/config';
import { useTitle } from '@/shared/lib';
import { MainLayout, PageTitle } from '@/shared/ui';

import styles from './page.module.css';

const LoginPage: React.FC = () => {
	useTitle('Вход');

	return (
		<MainLayout className={styles.layout} header={<Header />}>
			<PageTitle className={styles.title} title='Добро пожаловать!' />
			<Card>
				<CardContent className={styles.content}>
					<LoginForm />
					<Typography className={styles.link}>
						<span className={styles.question}>Еще нет аккаунта?</span>
						<br /> Тогда{' '}
						<MUILink to={routes.auth.registration} component={Link}>
							создайте его
						</MUILink>{' '}
						прямо сейчас
					</Typography>
				</CardContent>
			</Card>
		</MainLayout>
	);
};

export default LoginPage;
