import solc from 'solc';
import { CompileResponseBody } from './types';

const FILE_NAME = 'file.sol';

export class CompilerService {
	async compile(content: string): Promise<CompileResponseBody> {
		const complicator = {
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
		const output = JSON.parse(solc.compile(JSON.stringify(complicator)));

		console.log(output);

		const error = checkErrors(output.errors);

		if (error) {
			return error;
		}

		const contracts = output.contracts[FILE_NAME] as Record<string, any>;

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

const checkErrors = (errors: any[]): any => {
	// eslint-disable-next-line no-restricted-syntax
	for (const error of errors) {
		if (error.type !== 'Waring') {
			return error;
		}
	}

	return null;
};

export const compilerService = new CompilerService();
