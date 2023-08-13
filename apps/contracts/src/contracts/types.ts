import type { ContractAbi } from 'web3-types';

export interface SelectContract {
	readonly id: string;
}

export interface CompiledContractData {
	readonly abi: ContractAbi;
	readonly bytecode: string;
}

export interface CompileResponseBody {
	readonly contracts: CompiledContracts;
}

export type CompiledContracts = Record<
	string,
	CompiledContractData | undefined
>;
