import { coreApi } from '../core';

import {
	Contract,
	ContractContainerIdParams,
	ContractIdParams,
	CreateContractParams,
	RedeployContractParams,
	UpdateContractParams,
} from './types';

const url = 'contracts/contracts';

export const getAll = (
	params: ContractContainerIdParams
): Promise<Contract[]> => {
	return coreApi.request(`${url}/${params.containerId}`).json();
};

export const getOne = (params: ContractIdParams): Promise<Contract> => {
	return coreApi.request(`${url}/${params.containerId}/${params.id}`).json();
};

export const create = (params: CreateContractParams): Promise<Contract> => {
	const { containerId, ...rest } = params;

	const body = new FormData();

	Object.entries(rest).forEach(([key, value]) => {
		if (!value) {
			return;
		}

		body.append(key, value as string | File);
	});

	return coreApi
		.request(`${url}/${containerId}`, { method: 'post', body })
		.json();
};

export const update = (params: UpdateContractParams): Promise<Contract> => {
	const { containerId, id, ...body } = params;

	return coreApi
		.request(`${url}/${containerId}/${id}`, {
			method: 'patch',
			json: body,
		})
		.json();
};

export const redeploy = (params: RedeployContractParams): Promise<Contract> => {
	const { containerId, id, ...body } = params;

	return coreApi
		.request(`${url}/${containerId}/${id}/redeploy`, {
			method: 'post',
			json: body,
		})
		.json();
};

export const remove = (params: ContractIdParams): Promise<boolean> => {
	return coreApi
		.request(`${url}/${params.containerId}/${params.id}`, {
			method: 'delete',
		})
		.json();
};

export const removeAll = (
	params: ContractContainerIdParams
): Promise<boolean> => {
	return coreApi
		.request(`${url}/${params.containerId}`, {
			method: 'delete',
		})
		.json();
};
