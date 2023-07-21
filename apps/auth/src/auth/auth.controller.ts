import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { COOKIE_NAME } from '@/shared';
import { AuthService } from './auth.service';
import { RequiredCookie, Cookie, CookieData } from './lib';
import { AuthResponseDto, LoginDto, RegistrationDto, TokensDto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

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
	) {
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
		type: Boolean,
		description: 'Registration success',
	})
	@ApiConflictResponse({
		description: 'User already registered',
	})
	registration(@Body() data: RegistrationDto): Promise<boolean> {
		return this.authService.registration(data);
	}

	@Delete('/logout')
	@RequiredCookie(COOKIE_NAME, false)
	@ApiOperation({
		summary: 'Logout from account',
	})
	@ApiOkResponse({
		type: Boolean,
		description: 'Logout success',
	})
	async logout(
		@Cookie(COOKIE_NAME) cookie: CookieData<string>
	): Promise<boolean> {
		cookie.clearCookie();
		return true;
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
