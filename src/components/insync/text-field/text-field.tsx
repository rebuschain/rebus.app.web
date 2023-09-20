import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

interface TextFieldProps {
	label: string;
	assistiveText: string;
	disabled: boolean;
	error: boolean;
	errorMessage: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, assistiveText, disabled, error, errorMessage }) => {
	return (
		<TextFieldStyled>
			<label className="label">{label}</label>
			<div className={classnames('input-wrapper', { error: error }, { disabled: disabled })}>
				<span className={'dot'} />
				<input type="text" />
				<span className={'dot'} />
				<button className={'max-button'} disabled={disabled}>
					Max
				</button>
			</div>
			<div className="assistive-text">{assistiveText}</div>
			{error && <div className="error-message"> {errorMessage} </div>}
		</TextFieldStyled>
	);
};

const TextFieldStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	width: fill;
	height: 48px;
	font-family: [ 'Inter', 'ui-sans-serif', 'system-ui' ];
	margin-bottom: 50px;

	.label {
		font-size: 14px;
		margin-bottom: 4px;
		font-weight: 500;
		color: ${props => props.theme.text};
	}

	.assistive-text {
		font-size: 12px;
		margin-top: 4px;
		font-weight: 400;
		color: ${props => props.theme.gray.darkest};
	}

	.error-message {
		font-size: 12px;
		margin-top: 4px;
		font-weight: 400;
		color: ${props => props.theme.error};
	}

	.dot {
		height: 24px;
		width: 24px;
		background-color: transparent;
		border: 2px solid ${props => props.theme.text};
		border-radius: 50%;
		display: inline-block;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		border: 1px solid ${props => props.theme.gray.light};
		border-radius: 8px;
		padding: 8px;
		gap: 8px;
		background-color: ${props => props.theme.background};
		color: ${props => props.theme.gray.dark};

		&:hover {
			border-color: ${props => props.theme.gray.dark};
		}

		&:active {
			border: 2px solid;
			border-image-slice: 1;
			border-image-source: ${props => props.theme.primary};
		}

		&.disabled {
			background-color: ${props => props.theme.gray.lightest};
			pointer-events: none;

			.dot {
				border: 2px solid ${props => props.theme.gray.dark};
				pointer-events: none;
			}
		}

		&.error {
			border-color: ${props => props.theme.error};
		}

		input {
			flex: 1;
			background-color: transparent;
			border: none;
			outline: none;
			color: ${props => props.theme.gray.dark};
			position: relative;
		}

		.max-button {
			background-color: ${props => props.theme.gray.lightest};
			color: ${props => props.theme.text};
			border: none;
			padding: 6px 16px;
			border-radius: 8px;
			cursor: pointer;

			&:disabled {
				background-color: ${props => props.theme.gray.light};
				color: ${props => props.theme.gray.dark};
				pointer-events: none;
			}
		}
	}
`;

export default TextField;
