import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
	(_: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		return request.user ?? null;
	}
);
