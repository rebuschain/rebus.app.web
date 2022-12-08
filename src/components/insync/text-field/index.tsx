import React, { FunctionComponent } from 'react';
import { TextField as MaterialTextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import styled from '@emotion/styled';
import classNames from 'classnames';

const useStyles = makeStyles(() => ({
	root: {
		'& .MuiOutlinedInput-root': {
			'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
				borderColor: '#696969',
				borderWidth: '1px',
			},
			'&.Mui-error .MuiOutlinedInput-notchedOutline': {
				borderColor: 'red',
			},
		},
		'& .MuiFormHelperText-root': {
			'&.Mui-error': {
				width: '100%',
				margin: '-6px 0',
			},
		},
		':-webkit-autofill': {
			WebkitBoxShadow: '0 0 0 1000px white inset',
			backgroundColor: 'red !important',
		},
	},
}));

type TextFieldProps = {
	className?: string;
	error?: boolean;
	disable?: boolean;
	errorText?: string;
	id: string;
	name: string;
	inputProps?: any;
	multiline?: boolean;
	onChange: (e: any) => void;
	placeholder?: string;
	type?: string;
	value?: string;
};

const TextField: FunctionComponent<TextFieldProps> = props => {
	const onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = e => {
		props.onChange(e.target.value);
	};

	return (
		<MaterialTextFieldStyled
			InputProps={props.inputProps ? props.inputProps : null}
			className={classNames(useStyles().root, 'text_field', props.className ? props.className : '')}
			disabled={props.disable ? props.disable : undefined}
			error={props.error}
			helperText={props.error ? <span className="error">{props.errorText}</span> : ''}
			id={props.id}
			margin="normal"
			multiline={props.multiline ? props.multiline : false}
			name={props.name}
			placeholder={props.placeholder}
			type={props.type ? props.type : 'text'}
			value={props.value}
			variant="outlined"
			onChange={onChange}
		/>
	);
};

const MaterialTextFieldStyled = styled(MaterialTextField)`
	width: 100%;
	position: relative;

	& > div {
		height: 2.573rem;
		font-weight: 100;
	}

	& > p {
		font-size: 12px;
		font-weight: 300;
		line-height: 30px;
		position: absolute;
		bottom: -20px;
	}

	input {
		padding: 0.429rem 1rem;
		height: 100%;
		box-sizing: border-box;
		font-family: 'Blinker', sans-serif;
		font-weight: 600;
		font-size: 24px;
		line-height: 130%;
		color: #696969;
	}

	fieldset {
		border-radius: 5px;
		border-color: #696969;
	}

	& > div:hover fieldset {
		border-color: #696969 !important;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		appearance: none;
		margin: 0;
	}

	.error {
		display: flex;
		justify-content: space-between;

		.icon {
			width: 16px;
			margin-bottom: 10px;
		}
	}

	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus {
		border: unset;
		-webkit-text-fill-color: #76838f;
		caret-color: #76838f;
		transition: background-color 5000s ease-in-out 0s;
	}

	&.search_text_field {
		.search_icons {
			display: flex;
			align-items: center;

			.icon {
				width: 24px;
			}

			.line {
				border: 1px solid #ffffff80;
				width: 2px;
				height: 20px;
				margin-left: 6px;
			}
		}

		.icon-menu {
			width: 24px;
			fill: #ffffff80;
		}

		& > div {
			background: linear-gradient(
				91.04deg,
				rgba(0, 0, 0, 0.3) -2.67%,
				rgba(0, 0, 0, 0.228) 48.93%,
				rgba(0, 0, 0, 0.3) 99.58%
			);
			border-radius: 50px;
		}

		fieldset {
			border: unset;
		}

		input {
			font-family: 'Blinker', sans-serif;
			font-size: 18px;
			line-height: 130%;
			color: #ffffff;
			opacity: 0.5;
		}
	}
`;

export default TextField;
