// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test, expect } from 'vitest';

import { utils } from 'web3-validator';
import { normalizeWeb3Response } from './normalize-web3-response';

describe('normalizeWeb3Response()', () => {
	const primitives = {
		string: 'string',
		number: 123,
		hex: utils.numberToHex(0),
		boolean: true,
		bigint: BigInt(123),
		numberString: '123',
		n: null,
	};

	const normalizedPrimitives = {
		string: 'string',
		number: 123,
		hex: utils.numberToHex(0),
		boolean: true,
		bigint: 123,
		numberString: 123,
		n: null,
	};

	const nestedObject = {
		...primitives,
		object: {
			...primitives,
			object: {
				...primitives,
			},
		},
	};

	const normalizedNestedObject = {
		...normalizedPrimitives,
		object: {
			...normalizedPrimitives,
			object: {
				...normalizedPrimitives,
			},
		},
	};

	describe('primitives', () => {
		test('should return boolean if passed boolean', () => {
			const normalized = normalizeWeb3Response(primitives.boolean);

			expect(normalized).toBe(normalizedPrimitives.boolean);
		});

		test('should return null if passed null', () => {
			const normalized = normalizeWeb3Response(primitives.n);

			expect(normalized).toBe(normalizedPrimitives.n);
		});

		test('should return string if passed any string', () => {
			const normalized = normalizeWeb3Response(primitives.string);

			expect(normalized).toBe(normalizedPrimitives.string);
		});

		test('should return number if passed number string', () => {
			const normalized = normalizeWeb3Response(primitives.numberString);

			expect(normalized).toBe(normalizedPrimitives.numberString);
		});

		test('should return hex string if passed hex string', () => {
			const normalized = normalizeWeb3Response(primitives.hex);

			expect(normalized).toBe(normalizedPrimitives.hex);
		});

		test('should return number if passed number', () => {
			const normalized = normalizeWeb3Response(primitives.number);

			expect(normalized).toBe(normalizedPrimitives.number);
		});

		test('should return number if passed bigint', () => {
			const normalized = normalizeWeb3Response(primitives.bigint);

			expect(normalized).toBe(normalizedPrimitives.bigint);
		});
	});

	describe('objects', () => {
		test('should return object with normalized fields', () => {
			const normalized = normalizeWeb3Response(primitives);

			expect(normalized).toEqual(normalizedPrimitives);
		});

		test('should return object with normalized ', () => {
			const normalized = normalizeWeb3Response(nestedObject);

			expect(normalized).toEqual(normalizedNestedObject);
		});

		test('should return parse as object if passed mixin of array and object ', () => {
			const mixin = { ...primitives, 0: 'str', 1: 123, length: 2, };

			const normalized = normalizeWeb3Response(mixin);

			expect(normalized).toEqual({ ...normalizedPrimitives, length: 2, });
		});
	});

	describe('array', () => {
		test('should return array with normalized primitives', () => {
			const normalized = normalizeWeb3Response([
				primitives.bigint,
				primitives.boolean,
				primitives.n
			]);

			expect(normalized).toEqual([
				normalizedPrimitives.bigint,
				normalizedPrimitives.boolean,
				normalizedPrimitives.n
			]);
		});

		test('should return array with normalized objects', () => {
			const normalized = normalizeWeb3Response([
				primitives,
				primitives,
				primitives
			]);

			expect(normalized).toEqual([
				normalizedPrimitives,
				normalizedPrimitives,
				normalizedPrimitives
			]);
		});

		test('should return array with normalized nested objects', () => {
			const normalized = normalizeWeb3Response([
				nestedObject,
				nestedObject,
				nestedObject
			]);

			expect(normalized).toEqual([
				normalizedNestedObject,
				normalizedNestedObject,
				normalizedNestedObject
			]);
		});

		test('should return array with normalized mixin objects', () => {
			const normalized = normalizeWeb3Response([
				primitives,
				primitives.bigint,
				nestedObject,
				[nestedObject]
			]);

			expect(normalized).toEqual([
				normalizedPrimitives,
				normalizedPrimitives.bigint,
				normalizedNestedObject,
				[normalizedNestedObject]
			]);
		});
	});
});
