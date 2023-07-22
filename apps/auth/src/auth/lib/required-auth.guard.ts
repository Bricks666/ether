import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
	OnModuleInit
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { extractToken } from './extract-token';
import type { Request } from 'express';

@Injectable()
export class RequiredAuthGuard implements CanActivate, OnModuleInit {
	authService: AuthService;

	constructor(private readonly moduleRef: ModuleRef) {}

	onModuleInit() {
		this.authService = this.moduleRef.get(AuthService, { strict: false, });
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const token = extractToken(request.headers.authorization);

		if (!token) {
			throw new BadRequestException('Invalid authorization header');
		}

		const user = await this.authService.extractUser(token);

		(request as any).user = user;

		return true;
	}
}
