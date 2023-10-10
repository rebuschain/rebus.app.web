import React, { FunctionComponent } from 'react';
import { useMatch } from 'react-router-dom';
import { ROUTES } from 'src/constants/routes';
import useWindowSize from 'src/hooks/use-window-size';
import { Sidebar } from './sidebar';
import styled from 'styled-components';

export const RouteWrapper: FunctionComponent<React.PropsWithChildren<unknown>> = ({ children }) => {
	const { isMobileView } = useWindowSize();
	const isNftIdViewRoute = !!useMatch(ROUTES.NFT_ID_VIEW);

	return (
		<div className="h-fit md:h-full w-full flex">
			{!isNftIdViewRoute && <Sidebar />}
			<BackgroundStyled
				className="h-fit md:h-full w-full flex justify-center text-white-high"
				style={{ maxWidth: isMobileView ? undefined : 'calc(100% - 206px)', overflowX: 'auto' }}>
				{children}
			</BackgroundStyled>
		</div>
	);
};

const BackgroundStyled = styled.div`
	background: ${props => props.theme.background};
`;
