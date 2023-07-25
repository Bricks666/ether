/* eslint-disable no-undef */
import type { Request } from 'express';
import type { Meta } from 'express-validator';

export const objectExistFile = (_: unknown, meta: Meta) => {
	const { req, path, } = meta as unknown as { req: Request; path: string };

	return isObject(req.files) && !!req.files[path]?.[0];
};

export const isObject = (
	files: Request['files']
): files is { [fieldname: string]: Express.Multer.File[] } => {
	return !!files && !Array.isArray(files);
};

export const existsSingle = (_: unknown, meta: Meta) => {
	const { req, } = meta as unknown as { req: Request };

	return !!req.file;
};

export const existsArray = (_: unknown, meta: Meta) => {
	const req = meta.req as unknown as Request;

	return Array.isArray(req.files);
};
export const arrayNotEmpty = (_: unknown, meta: Meta) => {
	const req = meta.req as unknown as Request;

	return !!req.files?.length;
};
