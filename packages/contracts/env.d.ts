/// <reference types="node" />

declare namespace NodeJS {
	interface ProcessEnv {
		readonly PORT: string;
		readonly NODE_HOST: string;
		readonly DB_FILE: string;
	}

	interface Process {
		env: ProcessEnv;
	}
}
