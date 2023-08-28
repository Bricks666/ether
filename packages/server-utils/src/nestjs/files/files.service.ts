/* eslint-disable no-undef */
import { join, resolve } from 'node:path';
import { writeFile, unlink, readFile } from 'node:fs/promises';
import {
	Inject,
	Injectable,
	InternalServerErrorException
} from '@nestjs/common';
import { v4 } from 'uuid';
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './files.module-definition';

@Injectable()
export class FilesService {
	#dir: string;

	#clientPath: string;

	constructor(@Inject(MODULE_OPTIONS_TOKEN) options: typeof OPTIONS_TYPE) {
		this.#dir = options.dir;
		this.#clientPath = options.clientPath;
	}

	async writeFile(params: WriteFileParams): Promise<string> {
		const { content, extension, name = v4(), subDir = '.', } = params;
		try {
			const fileName = name + extension;

			const fileSystemPath = this.getFileSystemPath(fileName);
			const servePath = this.getServePath(fileName);

			await writeFile(resolve(fileSystemPath, subDir), content);

			return servePath;
		} catch (error) {
			throw new InternalServerErrorException('Write file error', {
				cause: error,
			});
		}
	}

	async readFile<Encoding extends BufferEncoding | null | undefined>(
		params: ReadFileParams<Encoding>
	): Promise<Encoding extends null | undefined ? Buffer : string> {
		try {
			const { clientPath, encoding, } = params;

			const fileSystemPath = this.toFileSystemPath(clientPath);

			return readFile(fileSystemPath, encoding) as any;
		} catch (error) {
			throw new InternalServerErrorException('Read file error', {
				cause: error,
			});
		}
	}

	async removeFile(path: string): Promise<void> {
		try {
			await unlink(path);
		} catch (error) {
			throw new InternalServerErrorException('Remove file error', {
				cause: error,
			});
		}
	}

	getFileSystemPath(fileName: string): string {
		return resolve(this.#dir, fileName);
	}

	getServePath(fileName: string): string {
		return resolve(this.#clientPath, fileName);
	}

	toFileSystemPath(servePath: string): string {
		return join(this.#dir, servePath.replace(this.#clientPath, ''));
	}

	toServePath(fileSystemPath: string): string {
		return join(this.#clientPath, fileSystemPath.replace(this.#dir, ''));
	}
}

interface WriteFileParams {
	readonly content: string | NodeJS.ArrayBufferView;
	readonly extension: string;
	readonly name?: string;
	readonly subDir?: string;
}

interface ReadFileParams<Encoding extends BufferEncoding | null | undefined> {
	readonly clientPath: string;
	readonly encoding: Encoding;
}
