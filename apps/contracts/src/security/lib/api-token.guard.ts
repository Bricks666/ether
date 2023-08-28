import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common';
import { Request } from 'express';
import { API_TOKEN_HEADER } from '@/shared/config';
import { SecurityService } from '../security.service';

@Injectable()
export class ApiTokenGuard implements CanActivate {
	constructor(private readonly securityService: SecurityService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const token = request.headers[API_TOKEN_HEADER] as string | undefined;

		const isValid = this.securityService.validateApiToken(token);

		if (!isValid) {
			throw new BadRequestException('Token is not exist');
		}

		const user = this.securityService.extractUser(token);
		(request as any).user = user;

		return true;
	}
}
