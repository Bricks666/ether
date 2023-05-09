import { Database } from 'sqlite';
import sqlite from 'sqlite3';

export class DatabaseService extends Database {
	readonly #tablesCode: string[];

	constructor(filename: string) {
		super({
			filename,
			driver: sqlite.Database,
		});
		this.#tablesCode = [];
	}

	addTableCode(code: string) {
		this.#tablesCode.push(code);
	}

	async open(): Promise<void> {
		await super.open();
		await this.#createTables();
	}

	async #createTables(): Promise<void> {
		const requests = this.#tablesCode.map((code) => this.exec(code));
		await Promise.all(requests);
	}
}

export const databaseService = new DatabaseService('');
