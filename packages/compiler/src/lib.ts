import { type BinaryLike, createHash } from 'crypto';
import type { CompileError } from 'solc';

export const outputHasErrors = (
	errors: CompileError[],
	ignoreWarning = true
): boolean => {
	// eslint-disable-next-line no-restricted-syntax
	for (const error of errors) {
		console.log(errors);
		if (error.type === 'Warning' && !ignoreWarning) {
			return true;
		}
		if (error.type.includes('Error')) {
			return true;
		}
	}

	return false;
};

export const hash = (data: BinaryLike): string => {
	const hasher = createHash('sha256');
	return hasher.update(data).digest('hex');
};
