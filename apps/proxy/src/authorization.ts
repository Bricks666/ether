/* eslint-disable no-undef */
import lib from './lib.js';

interface StatusResponse {
	readonly success: boolean;
}

const checkToken = async (request: NginxHTTPRequest) => {
	const disableRequiredAccessToken =
		request.variables.disable_required_access_token ?? false;
	const response = await request.subrequest('/_send_authorization');

	if (response.status >= 300) {
		ngx.log(ngx.ERR, response.responseText);
		request.return(401, JSON.stringify(response));
		return;
	}

	const body = lib.parseBody<StatusResponse>(response.responseText);

	if (body === null) {
		if (disableRequiredAccessToken) {
			request.headersOut.Authorization = '';
			request.return(204);
		}
		ngx.log(ngx.ERR, response.responseText);
		request.return(500, JSON.stringify(body));
		return;
	}

	if (!body.success) {
		if (disableRequiredAccessToken) {
			request.headersOut.Authorization = '';
			request.return(204);
		}
		ngx.log(ngx.ERR, JSON.stringify(body));
		request.return(403);
		return;
	}

	request.return(204);
};

export default { checkToken, };
