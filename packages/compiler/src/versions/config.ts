import { join } from 'node:path';
import { addStaticDir } from '../lib';

export const VERSIONS_DIR = addStaticDir('versions');
export const VERSIONS_NAME = 'list.json';

export const VERSIONS_PATH = join(VERSIONS_DIR, VERSIONS_NAME);
