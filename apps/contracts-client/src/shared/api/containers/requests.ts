import { PaginationParams, coreApi } from '../core';

import {
	Container,
	ContainerIdParams,
	CreateContainerParams,
	UpdateContainerParams,
} from './types';

const url = 'containers';

export const getAll = (params: PaginationParams): Promise<Container[]> => {
	const query = new URLSearchParams(params as Record<string, string>);

	return coreApi
		.request(`${url}`, {
			searchParams: query,
		})
		.json();
};

export const getOne = (params: ContainerIdParams): Promise<Container> => {
	return coreApi.request(`${url}/${params.id}`).json();
};

export const create = (params: CreateContainerParams): Promise<Container> => {
	return coreApi
		.request(`${url}`, {
			method: 'post',
			json: params,
		})
		.json();
};

export const update = (params: UpdateContainerParams): Promise<Container> => {
	const { id, ...body } = params;

	return coreApi
		.request(`${url}/${id}`, {
			method: 'patch',
			json: body,
		})
		.json();
};

export const remove = (params: ContainerIdParams): Promise<boolean> => {
	return coreApi.request(`${url}/${params.id}`).json();
};
