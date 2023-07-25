import { defineConfig } from 'rollup';
import commonJs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
	input: { express: './src/express/index.ts', nestjs: './src/nestjs/index.ts' },
	output: [
		{
			dir: 'dist',
			format: 'esm',
			entryFileNames: '[name].mjs',
		},
		{
			dir: 'dist',
			format: 'cjs',
			entryFileNames: '[name].cjs',
		},
	],

	external: [/\.json/],
	plugins: [
		typescript({
			tsconfig: './tsconfig.build.json',
		}),
		commonJs({ extensions: ['.js', '.ts'] }),
	],
});
