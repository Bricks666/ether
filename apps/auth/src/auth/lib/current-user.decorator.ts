import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const currentUserFactory = (_: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest();
	return request.user ?? null;
};

export const CurrentUser = createParamDecorator(currentUserFactory);
