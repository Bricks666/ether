import { useLayoutEffect } from 'react';

import { NAME } from '../config';

export interface UseTitleParams {
	readonly returnOnUnmount?: boolean;
	readonly useSiteName?: boolean;
}

export const useTitle = (title: string, options: UseTitleParams = {}): void => {
	useLayoutEffect(() => {
		const getTitle = () => {
			if (!options.useSiteName) {
				return title;
			}

			return `${NAME}-${title}`;
		};

		const oldTitle = document.title;

		document.title = getTitle();

		if (!options.returnOnUnmount) {
			return;
		}

		return () => {
			document.title = oldTitle;
		};
	}, [title, options.returnOnUnmount, options.useSiteName]);
};
