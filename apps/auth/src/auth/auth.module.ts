import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [JwtModule, forwardRef(() => UsersModule)],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
