import { Card, CardContent, Typography, Link as MUILink } from '@mui/material';
import { Link } from 'atomic-router-react';
import * as React from 'react';

import { LoginForm } from '@/features/auth';

import { routes } from '@/shared/config';
import { AuthLayout, PageTitle } from '@/shared/ui';

import styles from './page.module.css';



const LoginPage: React.FC = () => {
	return (
		<AuthLayout className={styles.layout}>
			<PageTitle title='Добро пожаловать назад!' />
			<Card>
				<CardContent className={styles.content}>
					<LoginForm />
					<Typography className={styles.link}>
						<span className={styles.question}>Еще нет аккаунта?</span>
						<br /> Тогда{' '}
						<MUILink to={routes.registration} component={Link}>
							создайте его
						</MUILink>{' '}
						прямо сейчас
					</Typography>
				</CardContent>
			</Card>
		</AuthLayout>
	);
};

export default LoginPage;