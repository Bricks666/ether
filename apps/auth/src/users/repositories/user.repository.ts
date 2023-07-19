import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database';
import type { CreateUser, SelectUser, UpdateUser } from '../types';
import type { User } from '../entities';

@Injectable()
export class UserRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	getOne(params: SelectUser): Promise<User | null> {
		return (
			this.databaseService.user.findUnique({
				where: params,
			}) ?? null
		);
	}

	create(data: CreateUser): Promise<User> {
		return this.databaseService.user.create({
			data,
		});
	}

	update(params: SelectUser, data: UpdateUser): Promise<User | null> {
		return (
			this.databaseService.user.update({
				where: params,
				data,
			}) ?? null
		);
	}

	remove(params: SelectUser): Promise<User | null> {
		return (
			this.databaseService.user.delete({
				where: params,
			}) ?? null
		);
	}
}
