import { createMutation } from '@farfetched/core';
import { runtypeContract } from '@farfetched/runtypes';
import { createEffect, createStore, sample } from 'effector';
import { createForm } from 'effector-forms';
import { String } from 'runtypes';

import {
	RegistrationParams,
	authApi,
	isHttpErrorWithCode,
	statusResponse,
} from '@/shared/api';
import { createFormValidationRule } from '@/shared/lib';

const handlerFx = createEffect(authApi.registration);

export const query = createMutation({
	effect: handlerFx,
	contract: runtypeContract(statusResponse),
});

export const $error = createStore<string | null>(null);

interface FormOptions extends RegistrationParams {
	readonly repeatPassword: string;
}

export const form = createForm<FormOptions>({
	fields: {
		login: {
			init: '',
			rules: [
				createFormValidationRule({
					name: 'login',
					text: 'Логин не должен быть пустым',
					runtype: String.withConstraint((value) => value.length > 0),
				}),
			],
		},
		username: {
			init: '',
			rules: [
				createFormValidationRule({
					name: 'username',
					text: 'Имя должно быть не короче 6 символов',
					runtype: String.withConstraint((value) => value.length >= 6),
				}),
			],
		},
		password: {
			init: '',
			rules: [
				createFormValidationRule({
					name: 'password',
					text: 'Пароль должен быть не короче 6 символов',
					runtype: String.withConstraint((value) => value.length >= 6),
				}),
			],
		},
		repeatPassword: {
			init: '',
			rules: [
				{
					name: 'repeat password',
					errorText: 'Пароли не совпадает',
					validator: (value, form: FormOptions) => {
						return form.password === value;
					},
				},
			],
		},
	},
});

sample({
	clock: form.formValidated,
	target: query.start,
});

sample({
	clock: query.finished.failure,
	target: [form.fields.password.reset, form.fields.repeatPassword.reset],
});

sample({
	clock: query.finished.success,
	fn: () => null,
	target: $error,
});

sample({
	clock: query.finished.failure,
	filter: isHttpErrorWithCode(409),
	fn: () => 'Пользователь с таким логином или именем уже существует',
	target: $error,
});
