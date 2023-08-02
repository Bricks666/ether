/// <reference types="node" />

declare namespace NodeJS {
	interface ProcessEnv {
		readonly NODE_HOST: string;
		readonly COMPILER_HOST: string;
		readonly PORT?: string;
	}

	interface Process {
		env: ProcessEnv;
	}
}
