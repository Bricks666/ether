import { Module } from '@nestjs/common';
import { SecurityModule } from '@/security/security.module';
import { DeploysModule } from '@/deploys/deploys.module';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { ContractRepository } from './repositories';

@Module({
	imports: [SecurityModule, DeploysModule],
	controllers: [ContractsController],
	providers: [ContractsService, ContractRepository],
})
export class ContractsModule {}
