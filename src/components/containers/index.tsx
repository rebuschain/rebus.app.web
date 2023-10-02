import React, { FunctionComponent, ReactNode } from 'react';
import { ContainerWrapper } from './container-wrapper';
import { IContainerSettings, IContainerState, TCardTypes } from '../../interfaces';

export const Container: FunctionComponent<React.PropsWithChildren<TCardContainerProps>> = ({
	overlayClasses,
	className,
	children,
	settings = {},
}) => {
	return (
		<ContainerWrapper
			overlayClasses={overlayClasses}
			className={className}
			defaultState={IContainerState.ENABLED}
			draggable={settings?.draggable}
			focusable={settings?.focusable}
			hoverable={settings?.hoverable}>
			{children}
		</ContainerWrapper>
	);
};

interface TCardContainerProps {
	children: ReactNode;
	className?: string;
	overlayClasses?: string;
	type?: TCardTypes;
	settings?: IContainerSettings;
}
