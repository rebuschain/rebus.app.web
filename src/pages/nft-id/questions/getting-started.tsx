import styled from 'styled-components';
import React, { FunctionComponent } from 'react';
import gettingStarted from 'src/assets/nft-id-quiz/quiz-passing.png';
import { Loader } from 'src/components/common/loader';
import { useTheme } from 'styled-components';
import { darkTheme } from 'src/theme';
import { Button } from 'src/components/common/button';

type GettingStartedProps = {
	disabled?: boolean;
	onClick: () => void;
};

const loaderStyles: React.CSSProperties = {
	height: '100%',
	justifyContent: 'left',
	left: '18px',
	position: 'absolute',
	top: '0',
};

const GettingStarted: FunctionComponent<React.PropsWithChildren<GettingStartedProps>> = ({ disabled, onClick }) => {
	const theme = useTheme();
	const isDark = theme === darkTheme;
	return (
		<>
			<div className="image-wrapper">
				<img alt="getting-started" src={gettingStarted} style={{ filter: isDark ? 'none' : 'invert(1)' }} />
			</div>
			<TextStyled className="title text-center text-xl-2 py-6 leading-8">
				Before you create your NFTID, lets make sure you know what it is.
			</TextStyled>
			<TextStyled className="sub-text text-center text-base text-white-mid px-8">
				You will be asked 5 questions at random, you need to answer at least 4 of them correctly.
			</TextStyled>
			<Button disabled={disabled} backgroundStyle="primary" onClick={onClick} style={{ marginTop: '10px' }}>
				{disabled && <Loader className="h-7" style={loaderStyles} />}Get Started
			</Button>
		</>
	);
};

const TextStyled = styled.div`
	color: ${props => props.theme.text};
`;

export default GettingStarted;
