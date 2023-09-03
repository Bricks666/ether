import { Record, Number, Boolean, String, Static } from 'runtypes';

export const statusResponse = Record({
	status: String,
	statusCode: Number,
	success: Boolean,
});

export interface StatusResponse extends Static<typeof statusResponse> {}

export interface PaginationParams {
	readonly page?: number;
	readonly count?: number;
}
