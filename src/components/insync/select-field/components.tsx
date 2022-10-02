import styled from '@emotion/styled';
import { TextField } from '@material-ui/core';

export const TextFieldStyled = styled(TextField)`
	margin: 0 !important;
	min-width: 150px !important;
	width: auto;

	input {
		color: #111;
	}

	& > div {
		box-shadow: unset;
		border-radius: 23px;
	}

	& > div:before,
	& > div:after,
	& > div:hover:before {
		border: unset !important;
		border-radius: 5px;
	}

	& > div > div {
		height: max-content;
		box-sizing: border-box;
		padding: 10px;
		font-family: 'Blinker', sans-serif;
		font-weight: 600;
		font-size: 24px;
		line-height: 130%;
		color: #ffffff;
		margin-bottom: 2px;
	}

	svg {
		fill: #ffffff;
	}

	& > div > div:focus {
		background: unset;
	}
`;
