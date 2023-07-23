import { ApiCookieAuth } from '@nestjs/swagger';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { RequiredCookieGuard } from './required-cookie.guard';

export const RequiredCookie = (name: string, allowEmpty?: boolean) => {
	return applyDecorators(
		ApiCookieAuth(name),
		UseGuards(new RequiredCookieGuard(name, allowEmpty))
	);
};
