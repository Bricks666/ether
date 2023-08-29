import { VoidComponent } from 'solid-js';
import { Provider } from 'effector-solid';
import { fork } from 'effector';

export const withStore = (Component: VoidComponent): VoidComponent => {
	const scope = fork();

	return () => {
		return (
			<Provider value={scope}>
				<Component />
			</Provider>
		);
	};
};
