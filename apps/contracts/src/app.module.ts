import { PrismaDatabaseModule } from '@bricks-ether/server-utils/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractsModule } from './contracts/contracts.module';

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
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
