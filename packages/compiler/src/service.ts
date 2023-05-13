import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import solc, { type CompileOutput, type CompileOptions } from 'solc';
import { CompiledContracts } from './types';
import { hash, outputHasErrors } from './lib';
import { FILE_NAME, STATIC_DIR } from './config';

export class CompilerService {
	async compile(contract: string): Promise<CompiledContracts> {
		const fileName = hash(contract);
		const data = await getCompiledData(fileName);

		if (data) {
			return extractCompiledContracts(data);
		}

		const complicator: CompileOptions = createCompileOptions(contract);

		const compiled: CompileOutput = JSON.parse(
			solc.compile(JSON.stringify(complicator))
		);

		await saveCompiledData(fileName, compiled);

		const hasError = outputHasErrors(compiled.errors);

		if (hasError) {
			throw compiled.errors;
		}

		return extractCompiledContracts(compiled);
	}
}

const createCompileOptions = (content: string): CompileOptions => {
	return {
		language: 'Solidity',
		sources: {
			[FILE_NAME]: {
				content,
			},
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'],
				},
			},
		},
	};
};

const extractCompiledContracts = (
	compiled: CompileOutput
): CompiledContracts => {
	const contracts = compiled.contracts[FILE_NAME];

	return Object.entries(contracts).reduce((reduced, [key, value]) => {
		reduced[key] = {
			abi: value.abi,
			bytecode: value.evm.bytecode.object,
		};
		return reduced;
	}, {} as CompiledContracts);
};

const getCompiledData = async (
	fileName: string
): Promise<CompileOutput | null> => {
	return readFile(join(STATIC_DIR, fileName), { encoding: 'utf-8', })
		.then((data) => JSON.parse(data))
		.catch(() => null);
};

const saveCompiledData = async (
	fileName: string,
	compiledData: CompileOutput
) => {
	return writeFile(join(STATIC_DIR, fileName), JSON.stringify(compiledData));
};

export const compilerService = new CompilerService();
