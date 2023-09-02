import { ExtractValueType } from '@/shared/types';

export const DEVICES = {
	MOBILE: 'mobile',
	TABLET_VERTICAL: 'tablet-vertical',
	TABLET_HORIZONTAL: 'tablet-horizontal',
	SMALL_DESKTOP: 'small-desktop',
	DESKTOP: 'desktop',
} as const;

export type Devices = ExtractValueType<typeof DEVICES>;
