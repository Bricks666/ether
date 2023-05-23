import { resolve } from 'node:path';
import { type BinaryLike, createHash } from 'crypto';
import { mkdir } from 'node:fs/promises';
import createMulter, { memoryStorage } from 'multer';
import { STATIC_DIR } from './config';

export const hash = (data: BinaryLike): string => {
	const hasher = createHash('sha256');
	return hasher.update(data).digest('hex');
};

export const multer = createMulter({
	storage: memoryStorage(),
});

const dirs = [STATIC_DIR];

export const addStaticDir = (path: string): string => {
	const dir = resolve(STATIC_DIR, path);
	dirs.push(dir);
	return dir;
};

export const initStaticDirs = async () => {
	const requests = dirs.map((dir) => mkdir(dir, { recursive: true, }));

	return Promise.all(requests);
};
