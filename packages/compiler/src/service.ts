import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import solc, { type CompileOutput, type CompileOptions } from 'solc';
import { BadRequestError } from '@bricks-ether/server-utils';
import { CompiledContracts } from './types';
import { hash, outputHasErrors } from './lib';
import { FILE_NAME, STATIC_DIR } from './config';

export class CompilerService {
	async compile(contract: string): Promise<CompiledContracts> {
		const fileName = hash(contract);
		let data = await getCompiledData(fileName);

		if (!data) {
			const complicator: CompileOptions = createCompileOptions(contract);

			data = JSON.parse(
				solc.compile(JSON.stringify(complicator))
			) as CompileOutput;

			await saveCompiledData(fileName, data);
		}

		const hasError = outputHasErrors(data.errors);

		if (hasError) {
			throw new BadRequestError({
				cause: data.errors,
			});
		}

		return extractCompiledContracts(data);
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
			optimizer: {
				enabled: true,
				runs: 100,
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
	return readFile(join(STATIC_DIR, fileName), { encoding: 'utf-8' })
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
