import solc, { type CompileOutput, type CompileOptions } from 'solc';
import { CompileResponseBody } from './types';
import { outputHasErrors } from './lib';

const FILE_NAME = 'file.sol';

export class CompilerService {
	async compile(content: string): Promise<CompileResponseBody> {
		const complicator: CompileOptions = {
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
		const output: CompileOutput = JSON.parse(
			solc.compile(JSON.stringify(complicator))
		);

		const hasError = outputHasErrors(output.errors);

		if (hasError) {
			throw output.errors;
		}

		const contracts = output.contracts[FILE_NAME];

		const result: CompileResponseBody = Object.entries(contracts).reduce(
			(reduced, [key, value]) => {
				reduced.contracts[key] = {
					abi: value.abi,
					bytecode: value.evm.bytecode.object,
				};
				return reduced;
			},
			{ contracts: {}, } as CompileResponseBody
		);

		return result;
	}
}

export const compilerService = new CompilerService();
