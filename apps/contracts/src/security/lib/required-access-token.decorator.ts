import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from './access-token.guard';

export const RequiredAccessToken = () => {
	return applyDecorators(
		ApiBearerAuth,
		UseGuards(AccessTokenGuard),
		ApiForbiddenResponse({ description: 'Invalid token', })
	);
};
