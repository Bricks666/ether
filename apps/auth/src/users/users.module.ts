import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './repositories';
import { UsersController } from './users.controller';

@Module({
	providers: [UsersService, UserRepository],
	exports: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
