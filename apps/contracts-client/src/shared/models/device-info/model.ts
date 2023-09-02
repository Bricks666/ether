import { createDomain, sample } from 'effector';
import { equals, not } from 'patronum';

import { createToggler } from '@/shared/lib';
import { appModel } from '@/shared/models';

import { calculateDeviceInfo } from './lib';
import { DEVICES, Devices } from './types';

const deviceIntoDomain = createDomain();

export const $device = deviceIntoDomain.store<Devices>(DEVICES.DESKTOP);
export const subscribed = createToggler({ domain: deviceIntoDomain });

export const subscribe = deviceIntoDomain.event();
export const unsubscribe = deviceIntoDomain.event();

export const $isDesktop = equals($device, DEVICES.DESKTOP);
export const $isSmallDesktop = equals($device, DEVICES.SMALL_DESKTOP);
export const $isTableHorizontal = equals($device, DEVICES.TABLET_HORIZONTAL);
export const $isTabletVertical = equals($device, DEVICES.TABLET_VERTICAL);
export const $isMobile = equals($device, DEVICES.MOBILE);

const calculateFx = deviceIntoDomain.effect<any, Devices>(() => {
	return calculateDeviceInfo(window.innerWidth);
});

const subscribeFx = deviceIntoDomain.effect(async () => {
	window.addEventListener('resize', calculateFx);
	return calculateFx(null);
});

const unsubscribeFx = deviceIntoDomain.effect(async () => {
	window.removeEventListener('resize', calculateFx);
});

sample({
	clock: appModel.started,
	target: subscribe,
});

sample({
	clock: subscribe,
	filter: not(subscribed.$value),
	target: subscribeFx,
});

sample({
	clock: subscribeFx.done,
	target: calculateFx,
});

sample({
	clock: calculateFx.doneData,
	target: $device,
});

sample({
	clock: subscribeFx,
	target: subscribed.toggleOn,
});

sample({
	clock: unsubscribe,
	filter: subscribed.$value,
	target: unsubscribeFx,
});

sample({
	clock: unsubscribeFx,
	target: subscribed.toggleOff,
});
