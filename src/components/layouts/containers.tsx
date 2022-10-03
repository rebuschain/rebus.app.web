import styled from '@emotion/styled';
import { colorPrimary } from 'src/emotion-styles/colors';
import { onLgWidth, on2XlWidth } from 'src/emotion-styles/media-queries';

export const FullScreenContainer = styled.div`
	width: 100%;
	height: 100%;
`;

export const FullWidthContainer = styled.div`
	width: 100%;
	max-width: 1440px;
`;

export const CenterSection = styled.section`
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding: 40px;
`;

export const CenterV = styled.div`
	display: flex;
	align-items: center;
`;

export const CenterH = styled.div`
	display: flex;
	justify-content: center;
`;

export const Center = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const CenterSelf = styled.div`
	max-width: 1440px;
	margin-left: auto;
	margin-right: auto;
`;

export const WellContainer = styled.div`
	width: 100%;
	border-radius: 0.75rem;
	background-color: ${colorPrimary};
	padding: 18px 24px;
	@media (min-width: 768px) {
		padding: 24px 30px;
	}
`;
