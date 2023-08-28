/* eslint-disable no-nested-ternary */
import { Transform } from 'class-transformer';

export const ToBoolean = () => {
	return Transform((params) => {
		const isTrue = params.value === 'true';
		const isFalse = params.value === 'false';

		return isTrue ? true : isFalse ? false : params.value;
	});
};
