import { Domain, Event, Store, createDomain, sample } from 'effector';
import { not } from 'patronum';

import { popupsModel } from '../models';

export interface PopupControls {
	readonly close: Event<any>;
	readonly opened: Event<any>;
	readonly open: Event<any>;
	readonly closed: Event<any>;
}

export interface CreatePopupControlModelOptions<
	T extends Partial<PopupControls>
> {
	readonly domain?: Domain;
	readonly controls?: T;
}

export type PopupControlModel<T extends PopupControls> = T & {
	readonly $isOpen: Store<boolean>;
};

const popupControl = createDomain();

export const createPopupControlModel = <T extends Partial<PopupControls>>(
	popup: string,
	options: CreatePopupControlModelOptions<T> = {}
): PopupControlModel<PopupControls & T> => {
	const { domain = popupControl, controls = {} as Partial<PopupControls> } =
		options;

	const $isOpen = popupsModel.$popups.map((popups) => popups.includes(popup));

	const open = controls.open ?? domain.createEvent();
	const opened = controls.opened ?? domain.createEvent();
	const close = controls.close ?? domain.createEvent();
	const closed = controls.closed ?? domain.createEvent();

	sample({
		clock: open,
		filter: not($isOpen),
		fn: () => popup,
		target: popupsModel.open,
	});

	sample({
		clock: $isOpen,
		filter: Boolean,
		target: opened,
	});

	sample({
		clock: close,
		filter: $isOpen,
		fn: () => popup,
		target: popupsModel.close,
	});

	sample({
		clock: $isOpen,
		filter: (isOpen) => !isOpen,
		target: closed,
	});

	return { $isOpen, close, opened, open, closed } as PopupControlModel<
		PopupControls & T
	>;
};
