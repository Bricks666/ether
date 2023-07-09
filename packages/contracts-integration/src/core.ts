import Web3, { type Contract, type ContractAbi } from 'web3';
import {
	type NormalizedType,
	normalizeWeb3Response
} from './normalize-web3-response';
import { request } from './request';
import type { Callback, ContractInfo, ParamsWithContracts } from './types';

export interface CreateContractsIntegrationParams<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> {
	readonly providerHost: string;
	readonly contractsServiceHost: string;
	readonly contractName: string;
	readonly abi: ABI;
	readonly normalizeResponse?: NormalizeResponse;
}

export interface CreateContractsIntegrationResult<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> {
	readonly contract: Contract<ABI> | null;
	readonly fetch: () => Promise<Contract<ABI>>;
	readonly createRequest: CreateRequest<ABI, NormalizeResponse>;
}

interface CreateRequest<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> {
	<Response>(
		cb: Callback<ParamsWithContracts<ABI, Record<string, never>>, Response>
	): ContractResponse<Response, NormalizeResponse>;
	<Params extends Record<string, any>, Response>(
		cb: Callback<ParamsWithContracts<ABI, Params>, Response>
	): ContractResponse<Response, NormalizeResponse>;
}

type ContractResponse<
	Response,
	NormalizeResponse extends boolean
> = NormalizeResponse extends true ? NormalizedType<Response> : Response;

export const createContractsIntegration = <
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
>(
		params: CreateContractsIntegrationParams<ABI, NormalizeResponse>
	): CreateContractsIntegrationResult<ABI, NormalizeResponse> => {
	const {
		abi,
		contractName,
		providerHost,
		normalizeResponse,
		contractsServiceHost,
	} = params;

	const web3 = new Web3(providerHost);
	let contract: Contract<ABI> | null = null;

	const fetch = async (): Promise<Contract<ABI>> => {
		const response = await request<ContractInfo>(
			`${contractsServiceHost}/${contractName}`
		);
		contract = new web3.eth.Contract(abi, response.address);
		return contract;
	};

	const createRequest = (cb: any) => {
		return async (params: any = {}) => {
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

	return {
		get contract() {
			return contract;
		},
		createRequest,
		fetch,
	};
};
