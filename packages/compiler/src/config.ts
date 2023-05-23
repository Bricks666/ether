import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-underscore-dangle
export const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const STATIC_DIR = resolve(__dirname, 'static');
export const CONTRACT_NAME = 'contract.sol';
