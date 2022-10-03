import styled from '@emotion/styled';
import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from 'react';
import { colorPrimaryDarker } from 'src/emotion-styles/colors';
import { TradeClipboard } from './components/trade-clipboard';
import useWindowSize from 'src/hooks/use-window-size';

const MainPage: FunctionComponent = () => {
	return (
		<PageContainer>
			<TradeClipboardContainer>
				<TradeClipboardWrapper>
					<TradeClipboard />
				</TradeClipboardWrapper>
			</TradeClipboardContainer>
		</PageContainer>
	);
};

const PageContainer = styled.div`
	overflow: auto;
	position: relative;
	width: 100%;
`;

const TradeClipboardContainer = styled.div`
	margin: 0 auto;
	max-width: 520px;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;

	@media (min-width: 768px) {
		margin: 0;
		max-width: unset;
	}
`;

function TradeClipboardWrapper({ children }: { children: ReactNode }) {
	return (
		<TradePosition>
			<TradeContainer>{children}</TradeContainer>
		</TradePosition>
	);
}

const TradePosition = styled.div`
	position: static;
	padding: 96px 20px 64px;
	z-index: 3;
	width: 100%;

	@media (min-width: 768px) {
		position: absolute;
		padding: 0;
		width: 519.453px;
		left: 50%;
		transform: translateX(-50%);
	}

	@media (min-width: 1350px) {
		--tradeMinLeft: calc(920 * (100vh / 1080));
		--tradePositionLeft: calc((100vw - 206px) * 0.8 - 520px);
		left: min(var(--tradeMinLeft), var(--tradePositionLeft));
		transform: unset;
	}
`;

const TradeContainer = styled.div`
	width: 100%;
	max-height: 678px;
`;

export default MainPage;
