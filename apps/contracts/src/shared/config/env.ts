import { resolve } from 'node:path';

export const {COMPILER_HOST,} = process.env;
export const {NODE_HOST,} = process.env;
export const PORT = process.env.PORT ?? 5000;
export const STATIC_DIR = 'static';
export const STATIC_PATH = '/static';

export const STATIC_DIR_PATH = resolve(process.cwd(), STATIC_DIR);
