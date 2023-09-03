import { Record, Static, String } from 'runtypes';

export const wallet = Record({
	id: String,
	userId: String,
	address: String,
	password: String,
});

export interface Wallet extends Static<typeof wallet> {}

export interface WalletIdParams {
	readonly id: string;
}

export interface CreateWalletParas {
	readonly address: string;
	readonly password: string;
}
