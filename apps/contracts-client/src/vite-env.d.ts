/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly NETWORK: string;
	readonly API: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
