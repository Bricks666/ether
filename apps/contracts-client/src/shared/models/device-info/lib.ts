import type { Devices } from './types';

export const calculateDeviceInfo = (x: number): Devices => {
	if (x < 400) {
		return 'mobile';
	}
	if (x < 560) {
		return 'tablet-vertical';
	}

	if (x < 840) {
		return 'tablet-horizontal';
	}

	if (x < 1200) {
		return 'small-desktop';
	}

	return 'desktop';
};
