import { InternalServerErrorError } from '@bricks-ether/server-utils';
import { Range, coerce, valid } from 'semver';

const PRAGMA_VERSION_PATTERN = /pragma solidity [.\d>=<^~ ]+/;

export const extractVersionRange = (contract: string): Range | null => {
	const matches = contract.match(PRAGMA_VERSION_PATTERN);

	if (!matches) {
		return null;
	}

	const [, , ...versions] = matches[0].split(' ');

	for (const version of versions) {
		if (!valid(coerce(version))) {
			return null;
		}
	}

	return new Range(versions.join(' '));
};

export interface BuildInfo {
	readonly path: string;
	readonly version: string;
	readonly build: string;
	readonly longVersion: string;
	readonly keccak256: string;
	readonly sha256: string;
	readonly urls: string[];
	readonly prerelease?: string;
}

export interface SolidityCompilerVersionsResponse {
	readonly builds: BuildInfo[];
	readonly releases: Record<string, string>;
	readonly latestRelease: string;
}

export const getSolidityCompilerVersions =
	async (): Promise<SolidityCompilerVersionsResponse> => {
		const results = await fetch(
			'https://binaries.soliditylang.org/bin/list.json'
		);

		if (!results.ok) {
			throw new InternalServerErrorError({
				message: 'Solidity version coudlnot loaded',
				cause: results.statusText,
			});
		}

		return results.json();
	};

export interface PreparedVersions {
	readonly versions: Record<string, string>;
	readonly versionNumbers: string[];
	readonly latest: string;
}

export const prepareVersions = (
	versions: SolidityCompilerVersionsResponse
): PreparedVersions => {
	const result: PreparedVersions = {
		latest: versions.latestRelease,
		versionNumbers: [],
		versions: {},
	};

	for (const versionInfo of versions.builds) {
		result.versions[versionInfo.version] = versionInfo.longVersion;
		result.versionNumbers.push(versionInfo.version);
	}

	return result;
};
