// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, test, vi } from 'vitest';

import {
	CreateContractsIntegrationParams,
	createContractsIntegration
} from './core';
import type { ContractAbi } from 'web3';

vi.mock('web3');
vi.mock('./request');

describe('createContractsIntegration()', () => {
	const params: CreateContractsIntegrationParams<ContractAbi, true> = {
		abi: [],
		apiToken: 'token',
		containerId: 'containerId',
		host: 'host',
		network: 'network',
		deployId: 'deployId',
		normalizeResponse: true,
	};

	test('should return right struct', () => {
		const response = createContractsIntegration(params);

		expect(response).toEqual(expect.any(Object));
		expect(response.createRequest).toEqual(expect.any(Function));
		expect(response.fetch).toEqual(expect.any(Function));
		expect(response.getContract).toEqual(expect.any(Function));
	});

	describe('');
});
