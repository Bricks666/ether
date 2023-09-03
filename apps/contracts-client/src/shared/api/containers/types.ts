import { Boolean, Record, Static, String } from 'runtypes';

import { PaginationParams } from '../core';

export const container = Record({
	id: String,
	name: String,
	ownerId: String,
	isPrivate: Boolean,
	createdAt: String,
	updatedAt: String,
}).asReadonly();

export interface ContainerIdParams {
	readonly id: string;
}

export interface GetByUserParams extends PaginationParams {
	readonly userId: string;
}

export interface Container extends Static<typeof container> {}

export interface CreateContainerParams {
	readonly name: string;
	readonly isPrivate: boolean;
}

export interface UpdateContainerParams
	extends ContainerIdParams,
		CreateContainerParams {}
