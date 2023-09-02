import {
	createDomain,
	createEvent,
	createStore,
	sample,
	type Domain,
} from 'effector';

const togglerDomain = createDomain();

export interface CreateTogglerOptions {
	readonly defaultValue?: boolean;
	readonly domain?: Domain;
}

export const createToggler = ({
	defaultValue = false,
	domain = togglerDomain,
}: CreateTogglerOptions) => {
	const $value = createStore(defaultValue, { domain });
	const toggle = createEvent({ domain });
	const toggleOn = createEvent({ domain });
	const toggleOff = createEvent({ domain });

	sample({
		clock: toggle,
		source: $value,
		fn: (value) => !value,
		target: $value,
	});

	sample({
		clock: toggleOn,
		fn: () => true,
		target: $value,
	});

	sample({
		clock: toggleOff,
		fn: () => false,
		target: $value,
	});

	return {
		$value,
		toggle,
		toggleOff,
		toggleOn,
	};
};
