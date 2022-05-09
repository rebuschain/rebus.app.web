import React, { FunctionComponent } from 'react';
import { Button as MaterialButton, ButtonProps } from '@material-ui/core';
import styled from '@emotion/styled';
import { colorWhite, colorBlackLow } from 'src/emotionStyles/colors';

export const Button: FunctionComponent<ButtonProps & {
	backgroundStyle?: 'gradient-pink-blue' | 'gradient-pink' | 'gradient-blue' | 'gradient-green' | null;
	textTransform?: 'uppercase' | 'capitalize' | 'none';
}> = ({ backgroundStyle = 'gradient-pink-blue', children, textTransform = 'none', ...props }) => {
	let background = '';
	let textColor = colorWhite;

	if (backgroundStyle === 'gradient-pink') {
		background = 'linear-gradient(104.04deg, #e95062 0%, #e950d0 100%)';
	} else if (backgroundStyle === 'gradient-pink-blue') {
		background = 'linear-gradient(135deg, #e95062, #e950b3 52%, #5084e9)';
	} else if (backgroundStyle === 'gradient-green') {
		background = 'linear-gradient(104.04deg, #50e996 0%, #b8e950 100%)';
		textColor = colorBlackLow;
	} else if (backgroundStyle === 'gradient-blue') {
		background = 'linear-gradient(104.04deg, #5084e9 0%, #6f50e9 100%)';
	}

	return (
		<StyledMaterialButton
			background={background}
			textTransform={textTransform}
			textColor={textColor}
			variant="outlined"
			{...props}>
			{children}
		</StyledMaterialButton>
	);
};

const StyledMaterialButton = styled(MaterialButton)<{ background: string; textColor: string; textTransform: string }>`
	background: ${props => props.background};
	border: ${props => props.background && 'none !important'};
	border-radius: 20px !important;
	color: ${props => props.textColor};
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 14px;
	font-weight: 600;
	text-align: center;
	text-transform: ${props => props.textTransform} !important;

	&:disabled {
		opacity: 0.4;
	}

	& > span,
	& > p {
		color: ${props => props.textColor};
	}
`;
