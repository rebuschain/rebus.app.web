import React, { FunctionComponent } from 'react';
import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import classNames from 'classnames';
import './index.scss';

const useStyles = makeStyles(theme => ({
	root: {
		'& .MuiInput-underline': {
			'&.Mui-focused:after': {
				transform: 'scaleX(0)',
			},
		},
	},
}));

type Item = {
	key: string;
	name?: string;
	value: string;
	type?: string;
};

type SelectFieldProps = {
	className?: string;
	id: string;
	items: Item[];
	name: string;
	value: string;
	onChange: (e: any) => void;
	placeholder?: string;
};

const SelectField: FunctionComponent<SelectFieldProps> = props => {
	const onChange = (e: any) => props.onChange(e.target.value);

	return (
		<TextField
			select
			className={classNames(useStyles().root, 'text_field select_field ' + (props.className ? props.className : ''))}
			id={props.id}
			margin="normal"
			name={props.name}
			placeholder={props.placeholder ? props.placeholder : undefined}
			value={props.value}
			onChange={onChange}>
			{props.placeholder && (
				<MenuItem disabled value="none">
					{props.placeholder}
				</MenuItem>
			)}
			{props.items.map(item => (
				<MenuItem key={item.key || item.value || item.name || item.type} value={item.value || item.name || item.type}>
					{item.name ? item.name : item.type}
				</MenuItem>
			))}
		</TextField>
	);
};

export default SelectField;
