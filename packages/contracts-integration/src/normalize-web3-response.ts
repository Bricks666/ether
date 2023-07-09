import { isHexString } from 'web3-validator';

export type NumericPrimitive = number | bigint | `${number}`;
export type Primitive =
	| string
	| NumericPrimitive
	| null
	| undefined
	| boolean
	| symbol;

export type NormalizedPrimitiveType<T extends Primitive> =
	T extends NumericPrimitive ? number : T;

export type NormalizedArray<T extends Array<any>> = T extends Array<infer R>
	? Array<NormalizedType<R>>
	: never;

export type NormalizedRecordType<T extends Record<string, any>> = {
	[Key in keyof T]: NormalizedType<T[Key]>;
};

export type NormalizedType<T> = T extends Promise<any>
	? Promise<NormalizedType<Awaited<T>>>
	: T extends Array<any>
	? NormalizedArray<T>
	: T extends Record<string, any>
	? NormalizedRecordType<T>
	: T extends Primitive
	? NormalizedPrimitiveType<T>
	: unknown;

const normalizePrimitive = <T extends Primitive>(
	primitive: T
): NormalizedPrimitiveType<T> => {
	switch (typeof primitive) {
		case 'bigint':
		case 'number':
			return Number(primitive) as NormalizedPrimitiveType<T>;

		case 'string':
			if (
				Number.isNaN(Number.parseFloat(primitive)) ||
				isHexString(primitive)
			) {
				return primitive as NormalizedPrimitiveType<T>;
			}

			return Number.parseFloat(primitive) as NormalizedPrimitiveType<T>;

		default:
			return primitive as NormalizedPrimitiveType<T>;
	}
};

const normalizeRecord = <T extends Record<string, any>>(
	object: T
): NormalizedRecordType<T> => {
	return Object.entries(object).reduce((acc, [key, value]) => {
		if (!Number.isNaN(Number(key))) {
			return acc;
		}
		acc[key as keyof T] = normalizeWeb3Response(value);
		return acc;
	}, {} as NormalizedRecordType<T>);
};

const normalizeArray = <T extends Array<any>>(array: T): NormalizedArray<T> => {
	return array.map(normalizeWeb3Response) as NormalizedArray<T>;
};

export const normalizeWeb3Response = <T>(value: T): NormalizedType<T> => {
	// Checking for length need 'cause contract return hybrid of array and object struct
	// And this struct need to be converted as an object
	if (Array.isArray(value) && Object.keys(value).length === value.length) {
		return normalizeArray(value as T[]) as NormalizedType<T>;
	}

	if (typeof value === 'object' && value !== null) {
		return normalizeRecord(value) as NormalizedType<T>;
	}

	return normalizePrimitive(value as Primitive) as NormalizedType<T>;
};
