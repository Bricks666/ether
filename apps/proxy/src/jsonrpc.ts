/* eslint-disable no-undef */

import lib from './lib.js';

interface JSONRPCBody {
	readonly jsonrpc: string;
	readonly method: string;
	readonly params: unknown[];
}

const validateJSONRPC = (request: NginxHTTPRequest): void => {
	const blacklist: string[] | null = extractList(
		request.variables.jsonrpc_blacklist
	);
	const whitelist: string[] | null = extractList(
		request.variables.jsonrpc_whitelist
	);

	if (blacklist && whitelist) {
		return request.return(
			400,
			`invalid config: jsonrpc_blacklist and jsonrpc_whitelist are both set on ${request.uri}`
		);
	}

	const body = lib.parseBody<JSONRPCBody>(request.requestText);

	if (!body) {
		return request.return(400, 'invalid body');
	}

	const { jsonrpc, method, } = body;

	if (!jsonrpc || !method) {
		return request.return(
			400,
			`invalid request body: jsonrpc - ${jsonrpc} and method - ${method}`
		);
	}

	if (blacklist && blacklist.includes(method)) {
		return request.return(
			403,
			`method ${method} is not allowed on route ${request.uri}`
		);
	}

	if (whitelist && !whitelist.includes(method)) {
		return request.return(
			403,
			`method ${method} is not allowed on route ${request.uri}`
		);
	}

	return undefined;
};

const extractList = (variable: string | undefined): string[] | null => {
	if (typeof variable === 'undefined') {
		return null;
	}

	return variable.split(',');
};

export default { validateJSONRPC, };
