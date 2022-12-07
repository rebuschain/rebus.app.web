import React, { FunctionComponent } from 'react';
import { useRouteMatch } from 'react-router';
import { ROUTES } from 'src/constants/routes';
import useWindowSize from 'src/hooks/use-window-size';
import { Sidebar } from './sidebar';

export const RouteWrapper: FunctionComponent = ({ children }) => {
	const { isMobileView } = useWindowSize();
	const isNftIdViewRoute = !!useRouteMatch(ROUTES.NFT_ID_VIEW);

	return (
		<div className="h-fit md:h-full w-full flex">
			{!isNftIdViewRoute && <Sidebar />}
			<div
				className="h-fit md:h-full w-full flex justify-center text-white-high"
				style={{ maxWidth: isMobileView ? undefined : 'calc(100% - 206px)', overflowX: 'auto' }}>
				{children}
			</div>
		</div>
	);
};
