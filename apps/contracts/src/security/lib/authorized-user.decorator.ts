import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthorizedUser = createParamDecorator(
	(_: unknown, context: ExecutionContext) => {
		return context.switchToHttp().getRequest().user;
	}
);
