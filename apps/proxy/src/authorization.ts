/* eslint-disable no-undef */
import lib from './lib.js';

interface StatusResponse {
	readonly success: boolean;
}

const checkToken = async (request: NginxHTTPRequest) => {
	const requiredAccessToken = request.variables.required_access_token ?? 'on';

	const disableRequiredAccessToken = requiredAccessToken === 'off';

	const response = await request.subrequest('/_send_authorization');

	if (response.status >= 300) {
		if (disableRequiredAccessToken) {
			request.headersOut.Authorization = '';
			request.return(204);
			return;
		}
		ngx.log(ngx.ERR, response.responseText);
		request.return(401, JSON.stringify(response));
		return;
	}

	const body = lib.parseBody<StatusResponse>(response.responseText);

	if (body === null) {
		if (disableRequiredAccessToken) {
			request.headersOut.Authorization = '';
			request.return(204);
			return;
		}
		ngx.log(ngx.ERR, response.responseText);
		request.return(500, JSON.stringify(body));
		return;
	}

	if (!body.success) {
		if (disableRequiredAccessToken) {
			request.headersOut.Authorization = '';
			request.return(204);
			return;
		}
		ngx.log(ngx.ERR, JSON.stringify(body));
		request.return(404);
		return;
	}

	request.return(204);
};

export default { checkToken, };
