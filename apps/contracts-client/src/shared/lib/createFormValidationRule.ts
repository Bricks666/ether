import { Rule } from 'effector-forms';
import { Runtype } from 'runtypes';

export interface CreateFormValidationRuleParams<Value> {
	readonly name: string;
	readonly text: string;
	readonly runtype: Runtype<Value>;
}

export const createFormValidationRule = <Value>(
	params: CreateFormValidationRuleParams<Value>
): Rule<Value> => {
	const { name, text, runtype } = params;

	return {
		name,
		errorText: text,
		validator: (value) => {
			try {
				runtype.check(value);

				return true;
			} catch (error) {
				return false;
			}
		},
	};
};
