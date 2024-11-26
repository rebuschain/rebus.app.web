import React, { FunctionComponent } from 'react';
import { useMatch } from 'react-router-dom';
import { ROUTES } from 'src/constants/routes';
import useWindowSize from 'src/hooks/use-window-size';
import { Sidebar } from './sidebar';
import styled from 'styled-components';

interface RouteWrapperProps {
	toggleTheme: () => void;
	isDark: boolean;
}

export const RouteWrapper: FunctionComponent<React.PropsWithChildren<RouteWrapperProps>> = ({
	children,
	toggleTheme,
	isDark,
}) => {
	const { isMobileView } = useWindowSize();
	const isNftIdViewRoute = !!useMatch(ROUTES.NFT_ID_VIEW);

	return (
		<div className="h-fit md:h-full w-full flex">
			{/* {!isNftIdViewRoute && <Sidebar toggleTheme={toggleTheme} isDark={isDark} />} */}
			<BackgroundStyled
				className="h-fit md:h-full w-full flex justify-center text-white-high"
				style={{ overflowX: 'auto' }}>
				{children}
			</BackgroundStyled>
		</div>
	);
};

const BackgroundStyled = styled.div`
	background: ${props => props.theme.background};
`;
