import type { Address, ContractAbi, Contract } from 'web3';

export type Callback<P, R> = (params: P) => R;

export interface ContractInfo {
	readonly name: string;
	readonly address: Address;
}

export type ParamsWithContracts<
	ABI extends ContractAbi,
	P extends Record<string, any>
> = P & {
	readonly contract: Contract<ABI>;
};
