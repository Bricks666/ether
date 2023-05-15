import { type CompilerService, compilerService } from './service';
import type { NextFunction, Request, Response } from 'express';

export class CompilerController {
	#compilerService: CompilerService;

	constructor(compilerService: CompilerService) {
		this.#compilerService = compilerService;
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
}

export const compilerController = new CompilerController(compilerService);
