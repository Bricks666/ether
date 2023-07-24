import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import solc from 'solc';
import { CONTRACT_NAME, COMPILED_DIR } from './config';
import type { CompileError, CompileOptions, CompileOutput } from 'solc';
import type { CompiledContracts } from './types';

export const outputHasErrors = (
	errors: CompileError[],
	ignoreWarning = true
): boolean => {
	// eslint-disable-next-line no-restricted-syntax
	for (const error of errors) {
		if (error.type === 'Warning' && !ignoreWarning) {
			return true;
		}
		if (error.type.includes('Error')) {
			return true;
		}
	}

	return false;
};

export const createCompileOptions = (content: string): CompileOptions => {
	return {
		language: 'Solidity',
		sources: {
			[CONTRACT_NAME]: {
				content,
			},
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'],
				},
			},
			optimizer: {
				enabled: true,
				runs: 100,
			},
		},
	};
};

export const extractCompiledContracts = (
	compiled: CompileOutput
): CompiledContracts => {
	const contracts = compiled.contracts[CONTRACT_NAME];
	return Object.entries(contracts).reduce((reduced, [key, value]) => {
		reduced[key] = {
			abi: value.abi,
			bytecode: value.evm.bytecode.object,
		};
		return reduced;
	}, {} as CompiledContracts);
};

export const getCompiledData = async (
	fileName: string
): Promise<CompileOutput | null> => {
	return readFile(join(COMPILED_DIR, fileName), 'utf-8')
		.then(JSON.parse)
		.catch(() => null);
};

export const saveCompiledData = async (
	fileName: string,
	compiledData: CompileOutput
) => {
	return writeFile(join(COMPILED_DIR, fileName), JSON.stringify(compiledData));
};

export const loadVersion = promisify(solc.loadRemoteVersion);
