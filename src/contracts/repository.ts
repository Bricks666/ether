import { DatabaseService, databaseService } from '../database';
import { GetByNameParams } from './types';

export interface ContractRow {
	readonly name: string;
	readonly address: string;
}

export class ContractsRepository {
	readonly #TABLE_NAME = 'contracts';

	readonly #databaseService: DatabaseService;

	constructor(databaseService: DatabaseService) {
		this.#databaseService = databaseService;
		this.#databaseService.addTableCode(
			`CREATE TABLE IF NOT EXISTS ${
				this.#TABLE_NAME
			} (name varchar(25) UNIQUE, address VARCHAR(64));`
		);
	}

	async getByName(params: GetByNameParams): Promise<ContractRow | undefined> {
		return this.#databaseService.get(
			`SELECT * FROM ${this.#TABLE_NAME} WHERE name = "${params.name}"`
		);
	}

	async create(params: ContractRow): Promise<ContractRow> {
		const { name, address, } = params;
		await this.#databaseService.exec(
			`INSERT INTO ${this.#TABLE_NAME} VALUES("${name}", ${address})`
		);
		return this.getByName({ name: params.name, }) as Promise<ContractRow>;
	}
}

export const contractsRepository = new ContractsRepository(databaseService);
