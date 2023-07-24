import { SecurityUserDto } from '@/users/dto';
import { TokensDto } from './tokens.dto';

export class AuthResponseDto {
	declare user: SecurityUserDto;

	declare tokens: TokensDto;
}
