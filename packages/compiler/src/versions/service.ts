import { BadRequestError } from '@bricks-ether/server-utils';
import { maxSatisfying } from 'semver';
import { readFile, access, writeFile, constants } from 'node:fs/promises';
import {
	PreparedVersions,
	extractVersionRange,
	getSolidityCompilerVersions,
	prepareVersions,
} from './lib';
import { VERSIONS_PATH } from './config';

export class CompilerVersionService {
	async getCompilerVersion(contract: string): Promise<string> {
		const range = extractVersionRange(contract);
		const versions = await this.getSolidityVersions();

		if (!range) {
			throw new BadRequestError({
				message: 'Passed incorrect version',
			});
		}

		const targetVersion = maxSatisfying(versions.versionNumbers, range);
		if (!targetVersion) {
			throw new BadRequestError({
				message: 'There is not allowed version',
			});
		}
		return versions.versions[targetVersion];
	}

	async getSolidityVersions(): Promise<PreparedVersions> {
		try {
			await access(VERSIONS_PATH, constants.R_OK);
			return readFile(VERSIONS_PATH, 'utf-8').then(JSON.parse);
		} catch {
			return this.loadSolidityVersion();
		}
	}

	async loadSolidityVersion(): Promise<PreparedVersions> {
		const versions = await getSolidityCompilerVersions().then(prepareVersions);
		await writeFile(VERSIONS_PATH, JSON.stringify(versions), 'utf-8');
		return versions;
	}
}

export const compilerVersionService = new CompilerVersionService();
