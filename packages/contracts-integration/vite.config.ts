/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src', 'index.ts'),
			formats: ['es', 'cjs'],
			fileName: 'index',
		},
		rollupOptions: {
			external: ['web3'],
		},
	},
	plugins: [dts()],
});
