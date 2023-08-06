import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SecurityService } from './security.service';

@Module({
	imports: [JwtModule],
	providers: [SecurityService],
	exports: [SecurityService],
})
export class SecurityModule {}
