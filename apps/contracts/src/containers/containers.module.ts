import { Module } from '@nestjs/common';
import { SecurityModule } from '@/security/security.module';
import { ContractsModule } from '@/contracts/contracts.module';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { ContainerRepository } from './repositories';

@Module({
	imports: [SecurityModule, ContractsModule],
	controllers: [ContainersController],
	providers: [ContainersService, ContainerRepository],
})
export class ContainersModule {}
