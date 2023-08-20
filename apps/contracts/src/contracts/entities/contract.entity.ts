import { ApiProperty } from '@nestjs/swagger';
import {
	IsUUID,
	IsString,
	IsEthereumAddress,
	IsBoolean,
	IsUrl,
	IsDateString,
	IsOptional,
	IsArray
} from 'class-validator';
import { Contract as ContractDeploy } from '@prisma/client';

export class Contract implements ContractDeploy {
	@ApiProperty({
		type: String,
		description: 'contract uuid',
	})
	@IsUUID()
	declare id: string;

	@ApiProperty({
		type: String,
		description: 'container uuid',
	})
	@IsUUID()
	declare containerId: string;

	@ApiProperty({
		type: String,
		description: 'contract name',
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
		type: String,
		isArray: true,
		description: 'deployed params',
	})
	@IsOptional()
	@IsArray()
	declare contractArguments: string[];

	@ApiProperty({
		type: String,
		description: 'deployed contract name',
	})
	@IsString()
	declare contractName: string;

	@ApiProperty({
		type: Boolean,
		description:
			'is private contract or not. Private contract allowed only for contract owner',
	})
	@IsOptional()
	@IsBoolean()
	declare isPrivate: boolean;

	@ApiProperty({
		type: String,
		description:
			'path to compiled data(abi and bytecode). Need for redeploy of this contract',
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
