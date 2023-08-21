import Web3, { type Contract, type ContractAbi } from 'web3';
import { normalizeWeb3Response } from './normalize-web3-response';
import { request } from './request';
import { API_TOKEN_NAME } from './config';
import type { ContractInfo, CreateRequest } from './types';

interface CreateFetchParams<ABI extends ContractAbi> {
	readonly abi: ABI;
	readonly network: string;
	readonly host: string;
	readonly containerId: string;
	readonly apiToken: string;
	readonly deployId?: string;
}

interface CreateFetchResult<ABI extends ContractAbi> {
	getContract(): Contract<ABI> | null;
	fetch(): Promise<Contract<ABI>>;
}

const createFetch = <ABI extends ContractAbi>(
	params: CreateFetchParams<ABI>
): CreateFetchResult<ABI> => {
	const { abi, apiToken, containerId, host, network, deployId, } = params;

	const web3 = new Web3(network);
	let contract: Contract<ABI> | null = null;

	const query = new URLSearchParams();

	if (deployId) {
		query.set('deployId', deployId);
	}

	const headers = new Headers({
		[API_TOKEN_NAME]: apiToken,
	});

	const fetch = async (): Promise<Contract<ABI>> => {
		const response = await request<ContractInfo>(
			`${host}/${containerId}/latest?${query.toString()}`,
			{
				headers,
			}
		);

		contract = new web3.eth.Contract(abi, response.deployedAddress);

		return contract;
	};

	return {
		getContract() {
			return contract;
		},
		fetch,
	};
};

interface CreateRequestCreatorParams<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> {
	getContract(): Contract<ABI> | null;
	readonly normalizeResponse?: NormalizeResponse;
}

const createRequestCreator = <
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
>(
		params: CreateRequestCreatorParams<ABI, NormalizeResponse>
	): CreateRequest<ABI, NormalizeResponse> => {
	const { getContract, normalizeResponse, } = params;

	return (cb: any) => {
		return async (params: any = {}) => {
			const contract = getContract();

			if (!contract) {
				throw new Error("Contract wasn't initialized");
			}

			const response = await cb({ ...params, contract, });

			if (!normalizeResponse) {
				return response;
			}

			return normalizeWeb3Response(response);
		};
	};
};

export interface CreateContractsIntegrationParams<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> extends CreateFetchParams<ABI>,
		Omit<CreateRequestCreatorParams<ABI, NormalizeResponse>, 'getContract'> {}

export interface CreateContractsIntegrationResult<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> extends CreateFetchResult<ABI> {
	readonly createRequest: CreateRequest<ABI, NormalizeResponse>;
}

export const createContractsIntegration = <
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
>(
		params: CreateContractsIntegrationParams<ABI, NormalizeResponse>
	): CreateContractsIntegrationResult<ABI, NormalizeResponse> => {
	const { normalizeResponse, ...fetchParams } = params;

	const { fetch, getContract, } = createFetch(fetchParams);

	const createRequest = createRequestCreator({
		getContract,
		normalizeResponse,
	});

	return {
		getContract,
		createRequest,
		fetch,
	};
};
