import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';
import { TokenRepository } from './repositories';

@Module({
	providers: [SecurityService, TokenRepository],
	exports: [SecurityService],
	controllers: [SecurityController],
})
export class SecurityModule {}
