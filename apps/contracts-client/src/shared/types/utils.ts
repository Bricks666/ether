export type ExtractValueType<T extends Record<any, any>> = T extends Record<
	any,
	infer R
>
	? R
	: never;

export type ExtractKeyType<T extends Record<any, any>> = T extends Record<
	infer R,
	any
>
	? R
	: never;
