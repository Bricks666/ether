/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import solid from 'vite-plugin-solid';
import suidPlugin from '@suid/vite-plugin';

export default defineConfig({
	plugins: [solid(), suidPlugin(), splitVendorChunkPlugin()],
	server: {
		proxy: {
			'/api': {
				changeOrigin: true,
				target: '10.147.19.30:81/api/v1',
			},
		},
	},
});
