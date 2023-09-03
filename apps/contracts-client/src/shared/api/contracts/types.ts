import { Array, Boolean, Record, Static, String } from 'runtypes';

export const contract = Record({
	id: String,
	containerId: String,
	name: String,
	walletId: String,
	contractArguments: Array(String).optional(),
	contractName: String,
	isPrivate: Boolean,
	compiledPath: String,
	deployedAddress: String,
	deployedAt: String,
});

export interface Contract extends Static<typeof contract> {}

export interface ContractContainerIdParams {
	readonly containerId: string;
}

export interface ContractIdParams extends ContractContainerIdParams {
	readonly id: string;
}

export interface CreateContractParams extends ContractContainerIdParams {
	readonly name: string;
	readonly walletId: string;
	readonly isPrivate: boolean;
	readonly contract: File;
	readonly contractName: string;
	readonly contractArguments?: string[];
}

export interface UpdateContractParams extends ContractIdParams {
	readonly name: string;
	readonly isPrivate: boolean;
}

export interface RedeployContractParams
	extends Pick<
			CreateContractParams,
			'name' | 'walletId' | 'isPrivate' | 'contractName'
		>,
		ContractIdParams {}
