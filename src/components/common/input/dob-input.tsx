import classNames from 'classnames';
import React from 'react';
import { TextInput } from './text-input';

export type DobInputProps = {
	className?: string;
	onChange: (name: string, value: string) => void;
	name: string;
	value?: string;
};

const inputStyle = { minWidth: '54px' };
const yearInputStyle = { minWidth: '62px' };

export const DobInput: React.FC<DobInputProps> = ({ className, onChange, name, value }) => {
	const [month = '', day = '', year = ''] = value?.split('/') || ['', '', ''];

	return (
		<div className={classNames(className, 'flex flex-1 w-full')}>
			<TextInput
				className="w-3/12 mr-1 text-center"
				onChange={(_, monthValue) => onChange(name, `${monthValue}/${day}/${year}`)}
				name="month"
				placeholder="MM"
				style={inputStyle}
				value={month}
			/>
			<TextInput
				className="w-3/12 mr-1 text-center"
				onChange={(_, dayValue) => onChange(name, `${month}/${dayValue}/${year}`)}
				name="day"
				placeholder="DD"
				style={inputStyle}
				value={day}
			/>
			<TextInput
				className="w-6/12 text-center"
				onChange={(_, yearValue) => onChange(name, `${month}/${day}/${yearValue}`)}
				name="year"
				placeholder="YYYY"
				style={yearInputStyle}
				value={year}
			/>
		</div>
	);
};
