import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';

export const BASE_COOKIE_OPTIONS: CookieOptions = {
	maxAge: 1000 * 60 * 60 * 24 * 30,
	sameSite: 'lax',
	secure: true,
	httpOnly: true,
};

export const cookieFactory = <T>(
	name: string,
	context: ExecutionContext
): CookieData<T> => {
	const request: Request = context.switchToHttp().getRequest();
	const response: Response = context.switchToHttp().getResponse();

	const value: T | null = request.cookies[name] ?? null;

	return {
		value,
		setCookie(value: T, options?: CookieOptions) {
			response.cookie(name, value, { ...BASE_COOKIE_OPTIONS, ...options, });
		},
		clearCookie() {
			response.clearCookie(name);
		},
	};
};

export interface CookieData<T> {
	readonly value: T | null;
	setCookie(value: T, options?: CookieOptions): void;
	clearCookie(): void;
}

export const Cookie = createParamDecorator(cookieFactory);
