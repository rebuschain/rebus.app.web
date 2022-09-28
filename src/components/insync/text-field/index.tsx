import React, { FunctionComponent } from 'react';
import { makeStyles, TextField as MaterialTextField } from '@material-ui/core';
import classNames from 'classnames';
import './index.scss';

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
		<MaterialTextField
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

export default TextField;
