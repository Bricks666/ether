/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_NETWORK: string;
	readonly VITE_API: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
