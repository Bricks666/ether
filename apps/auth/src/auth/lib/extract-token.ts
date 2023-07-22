export const extractToken = (
	header: string | null | undefined
): string | null => {
	if (!header) {
		return null;
	}

	const [type, token] = header.split(' ');

	if (type !== 'Bearer') {
		return null;
	}

	return token ?? null;
};
