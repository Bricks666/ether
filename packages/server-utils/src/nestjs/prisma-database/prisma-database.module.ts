import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './prisma-database.module-definition';
import { PrismaDatabaseService } from './prisma-database.service';

@Module({
	providers: [PrismaDatabaseService],
	exports: [PrismaDatabaseService],
})
export class PrismaDatabaseModule extends ConfigurableModuleClass {}
