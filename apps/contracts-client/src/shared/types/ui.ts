import { ReactNode } from 'react';

export interface CommonProps {
	className?: string;
}

export type Slots<Names extends string> = {
	[Key in Names]?: ReactNode;
};

export interface BasePopupProps extends CommonProps {
	readonly isOpen: boolean;
}
