declare namespace NodeJS {
	interface ProcessEnv {
		readonly PORT: number;
		readonly COOKIE_NAME: string;
		readonly SECRET: string;
		readonly ROUND: number;
	}

	interface Process {
		env: ProcessEnv;
	}
}
