import { querySync } from 'atomic-router';
import { createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum';

import { getParams } from '../config/query';
import { controls } from '../config/router';

const $rawPopups = createStore<string>('');

const parsePopups = (popups: string | null) => {
	return popups ? popups.split(',') : [];
};

const rawPopupChangedDebounced = debounce({
	source: $rawPopups,
	timeout: 210,
});

export const $mountedPopups = createStore<string[]>([]);
export const $popups = $rawPopups.map(parsePopups);

export const open = createEvent<string>();
export const close = createEvent<string>();

sample({
	clock: rawPopupChangedDebounced,
	fn: parsePopups,
	target: $mountedPopups,
});

console.log(querySync, controls, getParams);

querySync({
	controls,
	source: {
		[getParams.popup]: $rawPopups,
	},
});

sample({
	clock: close,
	source: $rawPopups,
	fn: (popups, popup) => {
		return popups.replaceAll(popup, '');
	},
	target: $rawPopups,
});

sample({
	clock: open,
	source: $rawPopups,
	fn: (popups, popup) => {
		if (!popups) {
			return popup;
		}

		return `${popups},${popup}`;
	},
	target: $rawPopups,
});
