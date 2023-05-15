declare module 'solc' {
	import type { AbiItem } from 'web3-utils';

	// METHODS

	// COMPILE
	export function compile(options: string): string;

	// Options
	export type CompileLanguage = 'Solidity';
	export interface CompileOptionsSource {
		readonly content: string;
	}
	export interface CompileOptionsSettings {
		readonly outputSelection: Record<string, CompileOptionsOutputSelection>;
	}
	export type CompileOptionsOutputSelection = Record<string, any>;

	export interface CompileOptions {
		readonly language: CompileLanguage;
		readonly sources: Record<string, CompileOptionsSource>;
		readonly settings: CompileOptionsSettings;
	}

	// RESULT
	export interface CompileOutput {
		readonly errors: CompileError[];
		readonly sources: Record<string, CompileOutputSource>;
		readonly contracts: Record<string, CompileOutputFile>;
	}

	export type CompileErrorComponent = 'general';
	export type CompileErrorCode = `${number}`;
	export type CompileErrorSeverity = 'warning' | 'error';
	export interface CompileErrorSourceLocation {
		readonly start: number;
		readonly end: number;
		readonly file: string;
	}
	export interface CompileErrorSecondarySourceLocations
		extends CompileErrorSourceLocation {
		readonly message: string;
	}
	export type CompileErrorType = 'Error' | 'Warning' | 'ParserError';

	export interface CompileError {
		readonly component: CompileErrorComponent;
		readonly errorCode: CompileErrorCode;
		readonly formattedMessage: string;
		readonly message: string;
		readonly secondarySourceLocations: CompileErrorSecondarySourceLocations[];
		readonly severity: CompileErrorSeverity;
		readonly sourceLocations: CompileErrorSourceLocation;
		readonly type: CompileErrorType;
	}

	export interface CompileOutputSource {
		readonly id: number;
	}

	export type CompileOutputFile = Record<string, CompileOutputContract>;
	export interface CompileOutputContract {
		readonly abi: AbiItem[];
		readonly devdoc: CompileOutputContractDoc<'dev'>;
		readonly evm: CompileOutputEvm;
		readonly ewasm: CompileOutputEWASM;
		readonly metadata: string;
		// Make typed later

		readonly storageLayout: object;
		readonly userdoc: CompileOutputContractDoc<'user'>;
	}

	export type DocKind = 'user' | 'dev';

	export interface CompileOutputContractDoc<K extends DocKind> {
		readonly kind: K;
		readonly methods: object;
		readonly version: number;
	}

	export interface CompileOutputEvm {
		readonly assembly: string;
		readonly bytecode: CompileOutputBytecode;
		readonly deployedBytecode: CompileOutputDeployedBytecode;
		readonly gasEstimates: CompileOutputGasEstimates;
		// Make typed later
		readonly legacyAssembly: object;
		readonly methodIdentifiers: Record<string, string>;
	}

	export interface CompileOutputBytecode {
		readonly functionDebugData: Record<string, CompileOutputFunctionDebugData>;
		readonly generatedSources: CompileOutputGeneratedSources;
		// I'm not sure
		readonly linkReferences: Record<string, unknown>;
		readonly object: string;
		readonly opcodes: string;
		readonly sourceMap: string;
	}

	export interface CompileOutputFunctionDebugData {
		readonly id: number | null;
		readonly entryPoint: number | null;
		readonly parameterSlots: number;
		readonly returnSlots: number;
	}

	export interface CompileOutputGeneratedSources {
		readonly ast: object;
	}

	export type GasEstimate = `${number}` | 'infinity';

	export interface CompileOutputGasEstimates {
		readonly creation: CompileOutputCreation;
		readonly external: Record<string, GasEstimate>;
		readonly internal: Record<string, GasEstimate>;
	}

	export interface CompileOutputCreation {
		readonly codeDepositCost: GasEstimate;
		readonly executionCost: GasEstimate;
		readonly totalCost: GasEstimate;
	}

	export interface CompileOutputEWASM {
		readonly wasm: string;
	}

	interface CompileOutputGeneratedSourcesAST {}

	// Make typed as
	type ASTNodeTypes =
		| 'YulBlock'
		| 'YulAssignment'
		| 'YulBreak'
		| 'YulCase'
		| 'YulContinue'
		| 'YulExpressionStatement'
		| 'YulForLoop'
		| 'YulFunctionCall'
		| 'YulFunctionDefinition'
		| 'YulIdentifier'
		| 'YulIf'
		| 'YulLeave'
		| 'YulLiteralHexValue'
		| 'YulLiteralValue'
		| 'YulSwitch'
		| 'YouTypedName'
		| 'YulVariableDeclaration';

	interface ASTNodeBase<NT extends ASTNodeTypes> {
		readonly nodeType: NT;
		readonly src: string;
	}

	interface ASTNodeBlock extends ASTNodeBase<'YulBlock'> {
		readonly statements: object;
	}

	interface ASTNodeAssignment extends ASTNodeBase<'YulAssignment'> {
		readonly value: any;
	}

	export type CompileOutputDeployedBytecode = CompileOutputBytecode;
}
