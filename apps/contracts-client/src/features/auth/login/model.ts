import { createMutation } from '@farfetched/core';
import { runtypeContract } from '@farfetched/runtypes';
import { createEffect, sample } from 'effector';
import { createForm } from 'effector-forms';
import { String } from 'runtypes';

import { LoginParams, authApi, authResponse } from '@/shared/api';
import { createFormValidationRule } from '@/shared/lib';
import { sessionModel } from '@/shared/models';

const handlerFx = createEffect(authApi.login);

export const login = createMutation({
	effect: handlerFx,
	contract: runtypeContract(authResponse),
});

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
					text: 'Password should contain at least than 6 symbols',
					runtype: String.withConstraint((value) => value.length >= 6),
				}),
			],
		},
	},
});

sample({
	clock: form.formValidated,
	target: login.start,
});

sample({
	clock: login.finished.failure,
	target: form.fields.password.reset,
});

sample({
	clock: login.finished.success,
	fn: ({ result }) => result.user,
	target: sessionModel.$user,
});
