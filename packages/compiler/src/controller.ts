import { type CompilerService, compilerService } from './compiler';
import {
	compilerVersionService,
	type CompilerVersionService
} from './versions';
import type { NextFunction, Request, Response } from 'express';

export class CompilerController {
	#compilerService: CompilerService;

	#compilerVersionService: CompilerVersionService;

	constructor(
		compilerService: CompilerService,
		compilerVersionService: CompilerVersionService
	) {
		this.#compilerService = compilerService;
		this.#compilerVersionService = compilerVersionService;
	}

	async compile(req: Request, res: Response, next: NextFunction) {
		try {
			const content = req.file!.buffer.toString();

			const contracts = await this.#compilerService.compile(content);

			res.json({ contracts, });
		} catch (error) {
			next(error);
		}
	}

	async refetchVersion(_: Request, res: Response, next: NextFunction) {
		try {
			await this.#compilerVersionService.loadSolidityVersion();
			res.send('OK');
		} catch (error) {
			next(error);
		}
	}
}

export const compilerController = new CompilerController(
	compilerService,
	compilerVersionService
);
