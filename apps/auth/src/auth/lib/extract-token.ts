import type { Request } from 'express';

export const extractToken = (req: Request): string | null => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return null;
	}
	const [type, token] = authHeader.split(' ');

	if (type !== 'Bearer') {
		return null;
	}

	return token ?? null;
};
