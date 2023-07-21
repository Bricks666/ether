import { UseGuards, applyDecorators } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { RequiredAuthGuard } from './required-auth.guard';

export const RequiredAuth = () => {
	return applyDecorators(
		UseGuards(RequiredAuthGuard),
		ApiBearerAuth(),
		ApiBadRequestResponse({ description: 'Invalid authorization header', }),
		ApiUnauthorizedResponse({ description: 'Invalid token', })
	);
};
