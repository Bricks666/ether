import { BadRequestError } from '@bricks-ether/server-utils';
import { hash } from '../lib';
import {
	type CompilerVersionService,
	compilerVersionService,
} from '../versions';
import {
	createCompileOptions,
	extractCompiledContracts,
	getCompiledData,
	loadVersion,
	outputHasErrors,
	saveCompiledData,
} from './lib';
import type { CompileOutput, CompileOptions } from 'solc';
import type { CompiledContracts } from './types';

export class CompilerService {
	#compilerVersionService: CompilerVersionService;

	constructor(compilerVersionsService: CompilerVersionService) {
		this.#compilerVersionService = compilerVersionsService;
	}

	async compile(contract: string): Promise<CompiledContracts> {
		const fileName = hash(contract);
		let data = await getCompiledData(fileName);

		if (!data) {
			const complicator: CompileOptions = createCompileOptions(contract);
			const version = await this.#compilerVersionService.getCompilerVersion(
				contract
			);

			const compiler = (await loadVersion(`v${version}`))!;

			data = JSON.parse(
				compiler.compile(JSON.stringify(complicator))
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

export const compilerService = new CompilerService(compilerVersionService);
