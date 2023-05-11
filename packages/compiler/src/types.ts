import type { AbiItem } from 'web3-utils';

export interface CompiledContractData {
	readonly abi: AbiItem[];
	readonly bytecode: string;
}

export interface CompileResponseBody {
	readonly contracts: Record<string, CompiledContractData>;
}
