import {
	type CanActivate,
	type ExecutionContext,
	Injectable
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class RequiredCookieGuard implements CanActivate {
	constructor(
		private readonly name: string,
		private readonly allowEmpty = false
	) {}

	canActivate(context: ExecutionContext): boolean {
		const request: Request = context.switchToHttp().getRequest();

		const value = request.cookies[this.name];

		if (typeof value === 'undefined' || value === null) {
			return false;
		}

		return Boolean(value) || this.allowEmpty;
	}
}
