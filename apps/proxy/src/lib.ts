const parseBody = <T>(body: string | null): T | null => {
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
};

export default { parseBody, };
