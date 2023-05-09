/// <reference types="node" />

declare namespace NodeJS {
	interface ProcessEnv {
		readonly PORT: string;
		readonly NODE_HOST: string;
		readonly DB_NAME: string;
		readonly DB_USER: string;
		readonly DB_PASSWORD: string;
	}

	interface Process {
		env: ProcessEnv;
	}
}
