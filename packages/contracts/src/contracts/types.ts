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

export interface DeployedResponseBody {
	readonly address: string;
}

export interface GetByNameParams {
	readonly name: string;
}
