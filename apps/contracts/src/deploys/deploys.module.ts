import { Module } from '@nestjs/common';
import { SecurityModule } from '@/security/security.module';
import { DeploysService } from './deploys.service';
import { DeploysController } from './deploys.controller';

@Module({
	imports: [SecurityModule],
	controllers: [DeploysController],
	providers: [DeploysService],
})
export class DeploysModule {}
