import { PrismaDatabaseModule } from '@bricks-ether/server-utils/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.local'],
		}),
		PrismaDatabaseModule.forRoot({
			isGlobal: true,
		})
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
