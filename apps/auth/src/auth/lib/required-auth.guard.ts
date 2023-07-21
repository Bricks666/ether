import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common';
import { extractToken } from './extract-token';
import type { AuthService } from '../auth.service';
import type { Request } from 'express';

@Injectable()
export class RequiredAuthGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const token = extractToken(request);

		if (!token) {
			throw new BadRequestException('Invalid authorization header');
		}

		const user = await this.authService.extractUser(token);

		(request as any).user = user;

		return true;
	}
}
