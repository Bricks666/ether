export const extractToken = (
	header: string | undefined | null
): string | null => {
	if (!header) {
		return null;
	}

	const [type, token] = header.split(' ');

	if (type !== 'Bearer') {
		return null;
	}

	return token || null;
};
