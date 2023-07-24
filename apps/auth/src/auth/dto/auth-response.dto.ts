import { ApiProperty } from '@nestjs/swagger';
import { SecurityUserDto } from '@/users/dto';
import { TokensDto } from './tokens.dto';

export class AuthResponseDto {
	@ApiProperty()
	declare user: SecurityUserDto;

	@ApiProperty()
	declare tokens: TokensDto;
}
