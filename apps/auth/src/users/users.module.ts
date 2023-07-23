import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@/auth/auth.module';
import { UsersService } from './users.service';
import { UserRepository } from './repositories';
import { UsersController } from './users.controller';

@Module({
	imports: [forwardRef(() => AuthModule)],
	providers: [UsersService, UserRepository],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
