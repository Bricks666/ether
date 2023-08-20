import { Module } from '@nestjs/common';
import { SecurityModule } from '@/security/security.module';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { WalletRepository } from './repositories';

@Module({
	imports: [SecurityModule],
	controllers: [WalletsController],
	providers: [WalletsService, WalletRepository],
	exports: [WalletsService],
})
export class WalletsModule {}
