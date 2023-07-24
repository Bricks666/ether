/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
	COOKIE_NAME,
	Cookie,
	CookieData,
	RequiredCookie,
	StatusResponseDto,
	createStatusResponse
} from '@/shared';
import { UsersService } from '@/users/users.service';
import { AuthService } from './auth.service';
import { RequiredAuth, CurrentUser } from './lib';
import { AuthResponseDto, LoginDto, RegistrationDto, TokensDto } from './dto';
import { UserTokenPayload } from './types';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@Get('/check_token')
	@RequiredAuth()
	@ApiOperation({
		summary: 'Check if access token valid',
	})
	@ApiOkResponse({
		type: StatusResponseDto,
		description: 'Validation status',
	})
	@ApiNotFoundResponse({
		description: 'Current user not found',
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid token',
	})
	@ApiBadRequestResponse({
		description: 'There is not auth header',
	})
	async checkToken(
		@CurrentUser() user: UserTokenPayload
	): Promise<StatusResponseDto> {
		await this.usersService.getOne({ id: user.id, });

		return createStatusResponse({
			status: 'valid',
			statusCode: 0,
		});
	}

	@Get('/me')
	@RequiredCookie(COOKIE_NAME, false)
	@ApiOperation({
		summary: 'Get authorized user data',
	})
	@ApiOkResponse({
		type: AuthResponseDto,
		description: 'Authorized user data and tokens',
	})
	@ApiNotFoundResponse({
		description: 'Current user not found',
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid token',
	})
	@ApiBadRequestResponse({
		description: 'There is not auth cookie',
	})
	async auth(
		@Cookie(COOKIE_NAME) cookie: CookieData<string>
	): Promise<AuthResponseDto> {
		const { value: token, setCookie, } = cookie;

		const response = await this.authService.getMe(token);

		setCookie(response.tokens.refreshToken);

		return response;
	}

	@Post('/login')
	@ApiOperation({
		summary: 'Login into account',
	})
	@ApiBody({
		type: LoginDto,
		description: 'User credentials',
	})
	@ApiOkResponse({
		type: AuthResponseDto,
		description: 'Authorized user data and tokens',
	})
	@ApiNotFoundResponse({
		description: 'Current user not found',
	})
	@ApiForbiddenResponse({
		description: 'Invalid password',
	})
	async login(
		@Body() data: LoginDto,
		@Cookie(COOKIE_NAME) cookie: CookieData<string>
	): Promise<AuthResponseDto> {
		const response = await this.authService.login(data);

		cookie.setCookie(response.tokens.refreshToken);

		return response;
	}

	@Post('/registration')
	@ApiOperation({
		summary: 'Registration new user',
	})
	@ApiBody({
		type: RegistrationDto,
		description: 'New user data',
	})
	@ApiOkResponse({
		type: StatusResponseDto,
		description: 'Registration success',
	})
	@ApiConflictResponse({
		description: 'User already registered',
	})
	async registration(
		@Body() data: RegistrationDto
	): Promise<StatusResponseDto> {
		const isValid = await this.authService.registration(data);

		return createStatusResponse({
			status: isValid ? 'registered' : 'error',
			statusCode: isValid ? 0 : 1,
		});
	}

	@Delete('/logout')
	@RequiredCookie(COOKIE_NAME, false)
	@ApiOperation({
		summary: 'Logout from account',
	})
	@ApiOkResponse({
		type: StatusResponseDto,
		description: 'Logout success',
	})
	async logout(
		@Cookie(COOKIE_NAME) cookie: CookieData<string>
	): Promise<StatusResponseDto> {
		cookie.clearCookie();

		return createStatusResponse({
			status: 'logout',
			statusCode: 0,
		});
	}

	@Get('/refresh')
	@RequiredCookie(COOKIE_NAME, false)
	@ApiOperation({
		summary: 'Refresh access token',
	})
	@ApiForbiddenResponse({
		type: 'Invalid token',
	})
	async refresh(
		@Cookie(COOKIE_NAME) cookie: CookieData<string>
	): Promise<TokensDto> {
		const { value: token, setCookie, } = cookie;

		const tokens = await this.authService.refresh(token);

		setCookie(tokens.refreshToken);
		return tokens;
	}
}
