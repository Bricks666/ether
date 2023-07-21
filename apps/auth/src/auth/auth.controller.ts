import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('/')
	auth() {
		return this.authService.findAll();
	}

	@Post('/login')
	login(@Body() createAuthDto: CreateAuthDto) {
		return this.authService.create(createAuthDto);
	}

	@Post('/registration')
	registration(@Body() createAuthDto: CreateAuthDto) {
		return this.authService.create(createAuthDto);
	}

	@Delete('/logout')
	logout(@Param('id') id: string) {
		return this.authService.findOne(+id);
	}

	@Get('/refresh')
	refresh(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto);
	}
}
