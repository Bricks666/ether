import { ApiProperty } from '@nestjs/swagger';
import {
	IsUUID,
	IsString,
	IsEthereumAddress,
	IsBoolean,
	IsUrl,
	IsDateString,
	IsOptional
} from 'class-validator';
import { Deploy as DeployModel } from '@prisma/client';

export class Deploy implements DeployModel {
	@ApiProperty({
		type: String,
		description: 'deploy uuid',
	})
	@IsUUID()
	declare id: string;

	@ApiProperty({
		type: String,
		description: 'contract uuid',
	})
	@IsUUID()
	declare contractId: string;

	@ApiProperty({
		type: String,
		description: 'deploy name',
	})
	@IsString()
	declare name: string;

	@ApiProperty({
		type: String,
		description: 'deployed wallet uuid',
	})
	@IsUUID()
	declare walletId: string;

	@ApiProperty({
		type: Boolean,
		description:
			'is private deploy or not. Private deploy allowed only for contract owner',
	})
	@IsOptional()
	@IsBoolean()
	declare private: boolean;

	@ApiProperty({
		type: String,
		description:
			'path to compiled data(abi and bytecode). Need for redeploy of this deploy',
	})
	@IsUrl({
		require_host: false,
		require_port: false,
		require_protocol: false,
	})
	declare compiledPath: string;

	@ApiProperty({
		type: String,
		description: 'ethereum address of deployed contract',
	})
	@IsEthereumAddress()
	declare deployedAddress: string;

	@ApiProperty({
		type: String,
		description: 'date of deployment',
	})
	@IsDateString()
	declare deployedAt: Date;
}
