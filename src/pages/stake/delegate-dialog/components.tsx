import styled from 'styled-components';

export const ResultDialogHeader = styled.h1`
	font-family: 'Blinker', sans-serif;
	color: ${props => props.theme.text};
	font-weight: 600;
	font-size: 24px;
	line-height: 29px;
	text-align: center;
	text-transform: uppercase;
`;

export const ResultDialogText = styled.p`
	font-family: 'Blinker', sans-serif;
	font-weight: 600;
	font-size: 20px;
	line-height: 24px;
	color: ${props => props.theme.text};
`;
