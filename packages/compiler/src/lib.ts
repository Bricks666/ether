import type { CompileError } from 'solc';

export const outputHasErrors = (
	errors: CompileError[],
	ignoreWarning = true
): boolean => {
	// eslint-disable-next-line no-restricted-syntax
	for (const error of errors) {
		if (error.type === 'Warning' && !ignoreWarning) {
			return true;
		}
		if (error.type === 'Error') {
			return true;
		}
	}

	return false;
};