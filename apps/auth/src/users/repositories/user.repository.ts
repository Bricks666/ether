import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database';
import type { CreateUser, SelectUser, UpdateUser } from '../types';
import type { User } from '../entities';

@Injectable()
export class UserRepository {
	constructor(private readonly databaseService: DatabaseService) {}

	async getOne(params: SelectUser): Promise<User | null> {
		const user = await this.databaseService.user.findUnique({
			where: params,
		});
		return user ?? null;
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
