import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { FilesModule } from '@bricks-ether/server-utils/nestjs';
import { SecurityModule } from '@/security/security.module';
import { env } from '@/shared/config';
import { WalletsModule } from '@/wallets/wallets.module';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { ContractRepository } from './repositories';

const contractDir = 'compiled';

@Module({
	imports: [
		SecurityModule,
		FilesModule.forRoot({
			isGlobal: false,
			dir: join(env.STATIC_DIR_PATH, contractDir),
			clientPath: join(env.STATIC_PATH, contractDir),
		}),
		WalletsModule
	],
	controllers: [ContractsController],
	providers: [ContractsService, ContractRepository],
	exports: [ContractsService],
})
export class ContractsModule {}
