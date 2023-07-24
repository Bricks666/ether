import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { TOKEN_SECRET } from '@/shared';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		JwtModule.register({
			secret: TOKEN_SECRET,
		}),
		forwardRef(() => UsersModule)
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
