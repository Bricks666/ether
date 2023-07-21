import type { CookieOptions } from 'express';

export const BASE_COOKIE_OPTIONS: CookieOptions = {
	maxAge: 1000 * 60 * 60 * 24 * 30,
	sameSite: 'lax',
	secure: true,
	httpOnly: true,
};
