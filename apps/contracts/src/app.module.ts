import { PrismaDatabaseModule } from '@bricks-ether/server-utils/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractsModule } from './contracts/contracts.module';
import { SecurityModule } from './security/security.module';
import { DeploysModule } from './deploys/deploys.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.local'],
		}),
		PrismaDatabaseModule.forRoot({
			isGlobal: true,
		}),
		ContractsModule,
		SecurityModule,
		DeploysModule,
		WalletsModule
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
