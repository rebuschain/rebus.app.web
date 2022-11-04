import React, { FunctionComponent } from 'react';
import { Button as MaterialButton, ButtonProps } from '@material-ui/core';
import styled from '@emotion/styled';
import { colorWhite, colorBlackLow } from 'src/emotion-styles/colors';

type Props = ButtonProps & {
	backgroundStyle?: 'gradient-pink-blue' | 'gradient-pink' | 'gradient-blue' | 'gradient-green' | 'blue' | null;
	smallBorderRadius?: boolean;
	smallFont?: boolean;
	textTransform?: 'uppercase' | 'capitalize' | 'none';
};

type StyledProps = {
	background: string;
	backgroundColor: string | undefined;
	smallBorderRadius?: boolean;
	smallFont?: boolean;
	textColor: string;
	textTransform: string;
};

export const Button: FunctionComponent<Props> = ({
	backgroundStyle = 'gradient-pink-blue',
	children,
	smallBorderRadius,
	smallFont,
	textTransform = 'none',
	...props
}) => {
	let background = '';
	let backgroundColor = undefined;
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
	} else if (backgroundStyle === 'blue') {
		background = '';
		backgroundColor = '#2F80ED';
	}

	return (
		<StyledMaterialButton
			background={background}
			backgroundColor={backgroundColor}
			smallBorderRadius={smallBorderRadius}
			smallFont={smallFont}
			textTransform={textTransform}
			textColor={textColor}
			variant="outlined"
			{...props}>
			{children}
		</StyledMaterialButton>
	);
};

const StyledMaterialButton = styled(
	({
		background,
		backgroundColor,
		smallBorderRadius,
		smallFont,
		textColor,
		textTransform,
		...rest
	}: Props & StyledProps) => <MaterialButton {...rest} />
)<StyledProps>`
	background: ${props => props.background};
	background-color: ${props => props.backgroundColor} !important;
	border: ${props => props.background && 'none !important'};
	border-radius: ${props => (props.smallBorderRadius ? '10px' : '20px')} !important;
	color: ${props => props.textColor};
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: ${props => (props.smallFont ? '12px' : '14px')} !important;
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
