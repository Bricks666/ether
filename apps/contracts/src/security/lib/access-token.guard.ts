import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common';
import { Request } from 'express';
import { extractToken } from '@/shared/lib';
import { SecurityService } from '../security.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
	constructor(private readonly securityService: SecurityService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const authorizationHeader = request.headers.authorization as
			| string
			| undefined;

		const token = extractToken(authorizationHeader);

		if (!token) {
			throw new BadRequestException('There is not access token');
		}

		const user = this.securityService.extractUser(token);
		(request as any).user = user;

		return true;
	}
}
