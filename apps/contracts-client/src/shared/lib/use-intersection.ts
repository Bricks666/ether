/* eslint-disable no-undef */
import { RefObject, useEffect, useState } from 'react';

export const useIntersection = (
	ref: RefObject<HTMLElement>,
	options: IntersectionObserverInit = {}
): IntersectionObserverEntry | null => {
	const [intersectionObserverEntry, setIntersectionObserverEntry] =
		useState<IntersectionObserverEntry | null>(null);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const handler = (entries: IntersectionObserverEntry[]) => {
			setIntersectionObserverEntry(entries[0]);
		};

		const observer = new IntersectionObserver(handler, options);
		observer.observe(ref.current);

		return () => {
			setIntersectionObserverEntry(null);
			observer.disconnect();
		};
	}, [ref.current, options.threshold, options.root, options.rootMargin]);

	return intersectionObserverEntry;
};
