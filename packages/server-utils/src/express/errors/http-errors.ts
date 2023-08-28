/* eslint-disable max-classes-per-file */
import { HTTPCodes } from './error-codes';

export interface HTTPErrorOptions extends ErrorOptions {
	readonly message: string;
	readonly statusCode: number;
	readonly cause?: any;
}

export class HTTPError extends Error {
	readonly statusCode: number;

	constructor(options: HTTPErrorOptions) {
		const { message, statusCode, cause, } = options;
		super(message, { cause, });
		this.statusCode = statusCode;
	}
}

export type InheritHTTPErrorOptions = Partial<
	Omit<HTTPErrorOptions, 'statusCode'>
>;

export class BadRequestError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'BadRequest', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.BadRequest,
		});
	}
}
export class UnauthorizedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'Unauthorized', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.Unauthorized,
		});
	}
}
export class PaymentRequiredError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'PaymentRequired', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.PaymentRequired,
		});
	}
}
export class ForbiddenError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'Forbidden', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.Forbidden,
		});
	}
}
export class NotFoundError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'NotFound', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.NotFound,
		});
	}
}
export class MethodNotAllowedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'MethodNotAllowed', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.MethodNotAllowed,
		});
	}
}
export class NotAcceptableError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'NotAcceptable', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.NotAcceptable,
		});
	}
}
export class ProxyAuthenticationRequiredError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'ProxyAuthenticationRequired', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.ProxyAuthenticationRequired,
		});
	}
}
export class RequestTimeoutError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'RequestTimeout', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.RequestTimeout,
		});
	}
}
export class ConflictError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'Conflict', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.Conflict,
		});
	}
}
export class GoneError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'Gone', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.Gone,
		});
	}
}
export class LengthRequiredError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'LengthRequired', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.LengthRequired,
		});
	}
}
export class PreconditionFailedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'PreconditionFailed', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.PreconditionFailed,
		});
	}
}
export class PayloadTooLargeError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'PayloadTooLarge', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.PayloadTooLarge,
		});
	}
}
export class URITooLongError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'URITooLong', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.URITooLong,
		});
	}
}
export class UnsupportedMediaTypeError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'UnsupportedMediaType', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.UnsupportedMediaType,
		});
	}
}
export class RangeNotSatisfiableError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'RangeNotSatisfiable', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.RangeNotSatisfiable,
		});
	}
}
export class ExpectationFailedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'ExpectationFailed', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.ExpectationFailed,
		});
	}
}
export class ImATeapotError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'ImATeapot', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.ImATeapot,
		});
	}
}
export class MisdirectedRequestError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'MisdirectedRequest', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.MisdirectedRequest,
		});
	}
}
export class UnprocessableEntityError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'UnprocessableEntity', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.UnprocessableEntity,
		});
	}
}
export class LockedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'Locked', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.Locked,
		});
	}
}
export class FailedDependencyError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'FailedDependency', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.FailedDependency,
		});
	}
}
export class TooEarlyError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'TooEarly', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.TooEarly,
		});
	}
}
export class UpgradeRequiredError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'UpgradeRequired', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.UpgradeRequired,
		});
	}
}
export class PreconditionRequiredError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'PreconditionRequired', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.PreconditionRequired,
		});
	}
}
export class TooManyRequestsError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'TooManyRequests', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.TooManyRequests,
		});
	}
}
export class RequestHeaderFieldsTooLargeError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'RequestHeaderFieldsTooLarge', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.RequestHeaderFieldsTooLarge,
		});
	}
}
export class UnavailableForLegalReasonsError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'UnavailableForLegalReasons', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.UnavailableForLegalReasons,
		});
	}
}
export class InternalServerErrorError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'InternalServerError', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.InternalServerError,
		});
	}
}
export class NotImplementedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'NotImplemented', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.NotImplemented,
		});
	}
}
export class BadGatewayError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'BadGateway', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.BadGateway,
		});
	}
}
export class ServiceUnavailableError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'ServiceUnavailable', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.ServiceUnavailable,
		});
	}
}
export class GatewayTimeoutError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'GatewayTimeout', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.GatewayTimeout,
		});
	}
}
export class HTTPVersionNotSupportedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'HTTPVersionNotSupported', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.HTTPVersionNotSupported,
		});
	}
}
export class VariantAlsoNegotiatesError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'VariantAlsoNegotiates', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.VariantAlsoNegotiates,
		});
	}
}
export class InsufficientStorageError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'InsufficientStorage', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.InsufficientStorage,
		});
	}
}
export class LoopDetectedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'LoopDetected', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.LoopDetected,
		});
	}
}
export class BandwidthLimitExceededError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'BandwidthLimitExceeded', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.BandwidthLimitExceeded,
		});
	}
}
export class NotExtendedError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'NotExtended', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.NotExtended,
		});
	}
}
export class NetworkAuthenticationRequiredError extends HTTPError {
	constructor(options: InheritHTTPErrorOptions = {}) {
		const { message = 'NetworkAuthenticationRequired', cause, } = options;
		super({
			message,
			cause,
			statusCode: HTTPCodes.NetworkAuthenticationRequired,
		});
	}
}
