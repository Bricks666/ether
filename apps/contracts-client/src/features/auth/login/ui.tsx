import { Button } from '@mui/material';
import cn from 'classnames';
import { useUnit } from 'effector-react';
import * as React from 'react';

import { useSubmit } from '@/shared/lib';
import { CommonProps } from '@/shared/types';
import { Field, Form, PasswordField } from '@/shared/ui';

import { form } from './model';
import styles from './ui.module.css';

export const LoginForm: React.FC<CommonProps> = (props) => {
	const { className } = props;
	const submit = useUnit(form.submit);

	const onSubmit = useSubmit(submit);

	return (
		<Form
			className={cn(styles.form, className)}
			onSubmit={onSubmit}
			variant='outlined'>
			<Login />
			<Password />
			<Button type='submit'>Войти</Button>
		</Form>
	);
};

const Login: React.FC = () => {
	const login = useUnit(form.fields.login);

	return (
		<Field
			value={login.value}
			onChange={login.onChange}
			onBlur={login.onBlur}
			helperText={login.errorText}
			isValid={login.isValid}
			name='login'
			label='Логин'
			autoComplete='username'
			required
		/>
	);
};

const Password: React.FC = () => {
	const password = useUnit(form.fields.password);

	return (
		<PasswordField
			value={password.value}
			onChange={password.onChange}
			onBlur={password.onBlur}
			helperText={password.errorText}
			isValid={password.isValid}
			name='password'
			label='Пароль'
			autoComplete='password'
			required
		/>
	);
};
