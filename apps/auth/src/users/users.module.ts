import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '@/auth';
import { UsersService } from './users.service';
import { UserRepository } from './repositories';
import { UsersController } from './users.controller';

@Module({
	imports: [forwardRef(() => AuthModule)],
	providers: [UsersService, UserRepository],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
