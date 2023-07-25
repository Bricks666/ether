/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { MODULE_OPTIONS_TOKEN } from './prisma-database.module-definition';

// @ts-ignore
type ClientOptions = Prisma.PrismaClientOptions;

@Injectable()
export class PrismaDatabaseService
	extends PrismaClient<ClientOptions, 'query' | 'beforeExit'>
	implements OnModuleInit
{
	constructor(@Inject(MODULE_OPTIONS_TOKEN) options: ClientOptions) {
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

		// @ts-ignore
		this.$on<'query'>('query', (e: Prisma.QueryEvent) => {
			console.log(`Query: ${e.query}`);
			console.log(`Params: ${e.params}`);
			console.log(`Duration: ${e.duration}ms`);
		});
	}
}
