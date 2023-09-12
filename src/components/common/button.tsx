import React from 'react';
import styled from 'styled-components';
import colors from 'src/colors';

interface ButtonProps {
	backgroundStyle?: 'primary' | 'secondary' | 'ghost' | null;
	textTransform?: 'uppercase' | 'capitalize' | 'none';
	children?: React.ReactNode;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	style?: React.CSSProperties;
	ref?: React.Ref<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
	backgroundStyle = 'primary',
	textTransform,
	children,
	onClick,
	disabled,
	style,
}) => {
	return (
		<ButtonStyled
			backgroundStyle={backgroundStyle}
			textTransform={textTransform}
			onClick={onClick}
			disabled={disabled}
			style={style}>
			{children}
		</ButtonStyled>
	);
};

const ButtonStyled = styled.button<ButtonProps>`
	display: flex;
	text-align: center;
	justify-content: center;
	background: ${props => {
		switch (props.backgroundStyle) {
			case 'primary':
				return props.theme.primary;
			case 'secondary':
				return props.theme.gray.lightest;
			case 'ghost':
				return 'transparent';
		}
	}};
	border: none;
	border-radius: 38px;
	color: ${props => {
		if (props.backgroundStyle === 'primary') {
			return colors.white;
		} else {
			return props.theme.text;
		}
	}};
	height: 48px;
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 16px;
	font-weight: 500;
	line-height: 24px;
	letter-spacing: 0em;
	padding: 12px 24px;
	text-transform: ${props => props.textTransform};

	&:disabled {
		background-image: none;
		background-color: ${props => props.theme.gray.medium};
		color: ${props => props.theme.gray.dark};
	}

	&:not(:disabled):hover {
		background: ${props => {
			switch (props.backgroundStyle) {
				case 'primary':
					return props.theme.linearGradient;
				case 'secondary':
					return props.theme.gray.lighter;
				case 'ghost':
					return props.theme.gray.lightest;
			}
		}};
	}

	&:not(:disabled):active {
		background: ${props => {
			switch (props.backgroundStyle) {
				case 'primary':
					return props.theme.linearGradient;
				case 'secondary':
					return props.theme.gray.lightest;
				case 'ghost':
					return props.theme.gray.lighter;
			}
		}};
	}
`;
