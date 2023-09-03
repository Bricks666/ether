import { createMutation } from '@farfetched/core';
import { runtypeContract } from '@farfetched/runtypes';
import { createEffect, createStore, sample } from 'effector';
import { createForm } from 'effector-forms';
import { String } from 'runtypes';

import {
	LoginParams,
	authApi,
	authResponse,
	isHttpErrorWithCode,
} from '@/shared/api';
import { createFormValidationRule } from '@/shared/lib';
import { sessionModel } from '@/shared/models';

const handlerFx = createEffect(authApi.login);

export const query = createMutation({
	effect: handlerFx,
	contract: runtypeContract(authResponse),
});

export const $error = createStore<string | null>(null);

export const form = createForm<LoginParams>({
	fields: {
		login: {
			init: '',
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
	},
});

sample({
	clock: form.formValidated,
	target: query.start,
});

sample({
	clock: query.finished.failure,
	target: form.fields.password.reset,
});

sample({
	clock: query.finished.success,
	target: sessionModel.auth.start,
});

sample({
	clock: query.finished.success,
	fn: () => null,
	target: $error,
});

sample({
	clock: query.finished.failure,
	filter: isHttpErrorWithCode(404),
	fn: () => 'Пользователя не существует',
	target: $error,
});

sample({
	clock: query.finished.failure,
	filter: isHttpErrorWithCode(403),
	fn: () => 'Неверный пароль',
	target: $error,
});
