import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDto {
	@ApiProperty()
	declare status: string;

	@ApiProperty()
	declare statusCode: number;

	@ApiProperty()
	declare success: boolean;
}

export interface CreateStatusResponseParams {
	readonly status: string;
	readonly statusCode: number;
}

export const createStatusResponse = (
	params: CreateStatusResponseParams
): StatusResponseDto => {
	return {
		status: params.status,
		statusCode: params.statusCode,
		success: params.statusCode === 0,
	};
};
