import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { MODULE_OPTIONS_TOKEN } from './database.module-definition';

@Injectable()
export class DatabaseService
	extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'beforeExit'>
	implements OnModuleInit
{
	constructor(
		@Inject(MODULE_OPTIONS_TOKEN) options: Prisma.PrismaClientOptions
	) {
		super({
			...options,
			log: [
				{
					emit: 'event',
					level: 'query',
				},
				{
					emit: 'stdout',
					level: 'error',
				},
				{
					emit: 'stdout',
					level: 'info',
				},
				{
					emit: 'stdout',
					level: 'warn',
				}
			],
		});
	}

	async onModuleInit() {
		await this.$connect();

		this.$on<'query'>('query', (e: Prisma.QueryEvent) => {
			console.log(`Query: ${e.query}`);
			console.log(`Params: ${e.params}`);
			console.log(`Duration: ${e.duration}ms`);
		});
	}
}
