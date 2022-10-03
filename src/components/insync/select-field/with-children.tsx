import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { TextFieldStyled } from './components';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiInput-underline': {
			'&.Mui-focused:after': {
				transform: 'scaleX(0)',
			},
		},
	},
}));

type SelectFieldProps = {
	className?: string;
	id: string;
	name: string;
	onChange: (e: any) => void;
	placeholder?: string;
	value: string;
};

const SelectField: FunctionComponent<SelectFieldProps> = props => {
	const onChange = (e: any) => props.onChange(e.target.value);

	return (
		<TextFieldStyled
			select
			className={classNames(useStyles().root, 'text_field select_field ' + (props.className ? props.className : ''))}
			id={props.id}
			margin="normal"
			name={props.name}
			placeholder={props.placeholder ? props.placeholder : undefined}
			value={props.value}
			onChange={onChange}>
			{props.children}
		</TextFieldStyled>
	);
};

export default SelectField;
