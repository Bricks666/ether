import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const STATIC_DIR = resolve(__dirname, 'compiled');
export const FILE_NAME = 'contract.sol';
