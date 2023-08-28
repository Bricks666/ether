import type { Address, ContractAbi, Contract } from 'web3';
import type { NormalizedType } from './normalize-web3-response';

export type Callback<P, R> = (params: P) => R;

export interface ContractInfo {
	readonly id: string;
	readonly containerId: string;
	readonly name: string;
	readonly walletId: string;
	readonly contractName: string;
	readonly contractArguments: string[];
	readonly compiledPath: string;
	readonly deployedAddress: Address;
	readonly deployedAt: Date;
	readonly isPrivate: boolean;
}

export type ParamsWithContracts<
	ABI extends ContractAbi,
	P extends Record<string, any>
> = P & {
	readonly contract: Contract<ABI>;
};

export interface CreateRequest<
	ABI extends ContractAbi,
	NormalizeResponse extends boolean
> {
	<Response>(
		cb: Callback<ParamsWithContracts<ABI, Record<string, never>>, Response>
	): Callback<void, ContractResponse<Response, NormalizeResponse>>;
	<Params extends Record<string, any>, Response>(
		cb: Callback<ParamsWithContracts<ABI, Params>, Response>
	): Callback<Params, ContractResponse<Response, NormalizeResponse>>;
}

export type ContractResponse<
	Response,
	NormalizeResponse extends boolean
> = NormalizeResponse extends true ? NormalizedType<Response> : Response;
