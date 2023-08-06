import { join } from 'path';
import { Module } from '@nestjs/common';
import { FilesModule } from '@bricks-ether/server-utils/nestjs';
import { env } from '@/shared/config';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';

@Module({
	imports: [
		FilesModule.forRoot({
			isGlobal: false,
			dir: join(env.STATIC_DIR_PATH, 'contracts'),
			clientPath: join(env.STATIC_PATH, 'contracts'),
		})
	],
	controllers: [ContractsController],
	providers: [ContractsService],
})
export class ContractsModule {}
