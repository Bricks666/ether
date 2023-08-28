import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { ToNumber } from '../lib';

export class PaginationDto {
	@ApiPropertyOptional({
		type: Number,
		default: 1,
		description: 'page number',
	})
	@ToNumber()
	@IsNumber()
	@IsOptional()
	readonly page?: number;

	@ApiPropertyOptional({
		type: Number,
		default: 100,
		description: 'count items on page',
	})
	@ToNumber()
	@IsNumber()
	@IsOptional()
	readonly count?: number;
}

export interface NormalizedPagination extends Required<PaginationDto> {}

export const normalizePagination = (
	pagination: PaginationDto
): NormalizedPagination => {
	return {
		count: Math.max(pagination.count ?? 10, 1),
		page: Math.max(pagination.page ?? 1, 1),
	};
};

export interface DatabasePagination {
	readonly take: number;
	readonly skip: number;
}

export const databasePagination = (
	pagination: NormalizedPagination
): DatabasePagination => {
	return {
		skip: pagination.count * (pagination.page - 1),
		take: pagination.count,
	};
};
