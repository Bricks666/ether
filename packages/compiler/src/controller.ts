import { Request, Response } from 'express';
import { CompilerService, compilerService } from './service';

export class CompilerController {
	#compilerService: CompilerService;

	constructor(compilerService: CompilerService) {
		this.#compilerService = compilerService;
	}

	async compile(req: Request, res: Response) {
		const content = req.file?.buffer.toString();

		if (!content) {
			return res.status(400).json({ error: 'empty', });
		}
		const contracts = await this.#compilerService.compile(content);

		res.json({ contracts, });
	}
}

export const compilerController = new CompilerController(compilerService);
