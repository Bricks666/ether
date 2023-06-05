import { AbiItem } from 'web3-utils';

interface BaseDeployRequestBody {
	readonly abi: AbiItem[];
	readonly bytecode: string;
	readonly name: string;
	readonly contractsArgs?: any[];
}

export interface AddressDeployRequestBody extends BaseDeployRequestBody {
	readonly senderAddress: string;
	readonly senderIndex?: never;
}

export interface IndexDeployRequestBody extends BaseDeployRequestBody {
	readonly senderAddress?: never;
	readonly senderIndex: number;
}

export type DeployRequestBody =
	| AddressDeployRequestBody
	| IndexDeployRequestBody;

export type FileDeployRequestBody = Omit<DeployRequestBody, 'abi' | 'bytecode'>;

export interface CompileAndDeployRequestBody extends FileDeployRequestBody {
	readonly contractNameInFile: string;
}

export interface CompiledContract {
	readonly abi: AbiItem[];
	readonly bytecode: string;
}

export type CompileResponse = Record<string, CompiledContract>;

export interface DeployedResponseBody {
	readonly name: string;
	readonly address: string;
}

export interface GetByNameParams {
	readonly name: string;
}
