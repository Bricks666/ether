import { SecurityUserDto } from '@/users';
import { TokensDto } from './tokens.dto';

export class AuthResponseDto {
	declare user: SecurityUserDto;

	declare tokens: TokensDto;
}
