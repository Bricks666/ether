import {
	FilesModule,
	PrismaDatabaseModule
} from '@bricks-ether/server-utils/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractsModule } from './contracts/contracts.module';
import { env } from './shared/config';
import { SecurityModule } from './security/security.module';
import { DeploysModule } from './deploys/deploys.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.local'],
		}),
		PrismaDatabaseModule.forRoot({
			isGlobal: true,
		}),
		FilesModule.forRoot({
			dir: env.STATIC_DIR_PATH,
			clientPath: env.STATIC_PATH,
		}),
		ContractsModule,
		SecurityModule,
		DeploysModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
