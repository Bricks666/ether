import { Transform } from 'class-transformer';

export const ToNumber = () => {
	return Transform((params) => {
		const transformed = Number(params.value);
		return Number.isNaN(transformed) ? params.value : transformed;
	});
};
