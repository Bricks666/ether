import { Button, Alert } from '@mui/material';
import cn from 'classnames';
import { useUnit } from 'effector-react';
import * as React from 'react';

import { useSubmit } from '@/shared/lib';
import { CommonProps } from '@/shared/types';
import { Field, Form, PasswordField } from '@/shared/ui';

import { $error, form, query } from './model';
import styles from './ui.module.css';

export const RegistrationForm: React.FC<CommonProps> = (props) => {
	const { className } = props;
	const submit = useUnit(form.submit);
	const pending = useUnit(query.$pending);

	const onSubmit = useSubmit(submit);

	return (
		<Form className={cn(styles.form, className)} onSubmit={onSubmit}>
			<Error />
			<Login />
			<Username />
			<Password />
			<RepeatPassword />
			<Button type='submit' disabled={pending}>
				Зарегистрироваться
			</Button>
		</Form>
	);
};

const Error: React.FC = () => {
	const error = useUnit($error);

	if (!error) {
		return null;
	}

	return <Alert severity='error'>{error}</Alert>;
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
			autoComplete='off'
			required
		/>
	);
};

const Username: React.FC = () => {
	const login = useUnit(form.fields.username);

	return (
		<Field
			value={login.value}
			onChange={login.onChange}
			onBlur={login.onBlur}
			helperText={login.errorText}
			isValid={login.isValid}
			name='login'
			label='Имя пользователя'
			autoComplete='off'
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
			autoComplete='off'
			required
		/>
	);
};

const RepeatPassword: React.FC = () => {
	const repeatPassword = useUnit(form.fields.repeatPassword);

	return (
		<PasswordField
			value={repeatPassword.value}
			onChange={repeatPassword.onChange}
			onBlur={repeatPassword.onBlur}
			helperText={repeatPassword.errorText}
			isValid={repeatPassword.isValid}
			name='repeatPassword'
			label='Повторите пароль'
			autoComplete='off'
			required
		/>
	);
};
