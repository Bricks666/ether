import { Card, CardContent, Typography, Link as MUILink } from '@mui/material';
import { Link } from 'atomic-router-react';
import * as React from 'react';

import { RegistrationForm } from '@/features/auth';

import { routes } from '@/shared/config';
import { useTitle } from '@/shared/lib';
import { AuthLayout, PageTitle } from '@/shared/ui';

import styles from './page.module.css';

const RegistrationPage: React.FC = () => {
	useTitle('Регистрация');

	return (
		<AuthLayout className={styles.layout}>
			<PageTitle className={styles.title} title='Добро пожаловать!' />
			<Card>
				<CardContent className={styles.content}>
					<RegistrationForm />
					<Typography className={styles.link}>
						<span className={styles.question}>Уже есть аккаунт?</span>
						<br /> Тогда{' '}
						<MUILink to={routes.auth.login} component={Link}>
							войдите в него
						</MUILink>{' '}
						прямо сейчас
					</Typography>
				</CardContent>
			</Card>
		</AuthLayout>
	);
};

export default RegistrationPage;
