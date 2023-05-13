import { Request } from 'express';
import { Meta } from 'express-validator';

export const filesExistFile = (_: unknown, meta: Meta) => {
	const { req, path, } = meta as unknown as { req: Request; path: string };

	return filesIsObject(req.files) && !!req.files[path]?.[0];
};

export const filesIsObject = (
	files: Request['files']
): files is { [fieldname: string]: globalThis.Express.Multer.File[] } => {
	return !!files && !Array.isArray(files);
};

export const singleFileExists = (_: unknown, meta: Meta) => {
	const { req, } = meta as unknown as { req: Request };

	return !!req.file;
};
