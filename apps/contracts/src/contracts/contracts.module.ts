import { Module } from '@nestjs/common';
import { SecurityModule } from '@/security/security.module';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { ContractRepository } from './repositories';

@Module({
	imports: [SecurityModule],
	controllers: [ContractsController],
	providers: [ContractsService, ContractRepository],
})
export class ContractsModule {}
