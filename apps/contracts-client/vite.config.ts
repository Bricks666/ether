/* eslint-disable import/no-extraneous-dependencies */
import { join } from 'node:path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { babel } from '@rollup/plugin-babel';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react(),
		babel({
			babelrc: true,
			configFile: true,
			babelHelpers: 'bundled',
			extensions: ['.ts', '.tsx'],
		}),
		splitVendorChunkPlugin(),
	],
	server: {
		proxy: {
			'/api': {
				changeOrigin: true,
				target: 'http://10.147.17.202:81/api/v1',
				rewrite: (path) => path.replace('/api', ''),
			},
		},
	},
	css: {
		devSourcemap: true,
	},
	resolve: {
		alias: {
			'@': join(__dirname, 'src'),
		},
	},
});
