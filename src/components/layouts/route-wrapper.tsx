import React, { FunctionComponent } from 'react';
import useWindowSize from 'src/hooks/use-window-size';
import { Sidebar } from './sidebar';

export const RouteWrapper: FunctionComponent = ({ children }) => {
	const { isMobileView } = useWindowSize();

	return (
		<div className="h-fit md:h-full w-full flex">
			<Sidebar />
			<div
				className="h-fit md:h-full w-full flex justify-center text-white-high"
				style={{ maxWidth: isMobileView ? undefined : 'calc(100% - 206px)', overflowX: 'auto' }}>
				{children}
			</div>
		</div>
	);
};
