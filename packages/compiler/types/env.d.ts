/// <reference types="node" />

declare namespace NodeJS {
	interface ProcessEnv {
		readonly PORT: string;
	}

	interface Process {
		env: ProcessEnv;
	}
}
