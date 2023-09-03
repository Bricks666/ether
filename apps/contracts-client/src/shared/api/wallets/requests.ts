import { coreApi } from '../core';

import { CreateWalletParas, Wallet, WalletIdParams } from './types';

const url = 'contracts/wallets';

export const getAll = (): Promise<Wallet[]> => {
	return coreApi.request(`${url}`).json();
};

export const getOne = (params: WalletIdParams): Promise<Wallet> => {
	return coreApi.request(`${url}/${params.id}`).json();
};

export const create = (params: CreateWalletParas): Promise<Wallet> => {
	return coreApi.request(`${url}`, { method: 'post', json: params }).json();
};

export const remove = (params: WalletIdParams): Promise<boolean> => {
	return coreApi.request(`${url}/${params.id}`, { method: 'delete' }).json();
};
