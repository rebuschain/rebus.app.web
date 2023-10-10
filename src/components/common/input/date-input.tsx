import classNames from 'classnames';
import React, { useState, ChangeEventHandler } from 'react';
import { TextInput, TextInputProps } from './text-input';
import { useTheme } from 'styled-components';

export type DateInputProps = {
	className?: string;
	onRawChange: ChangeEventHandler<HTMLInputElement>;
	name?: string;
	value?: string;
};

const DATE_FORMAT = 'MM/DD/YYYY';

export const DateInput: React.FC<React.PropsWithChildren<DateInputProps>> = ({
	className,
	onRawChange,
	name = '',
	value,
}) => {
	const theme = useTheme();
	const [formattedValue, setFormattedValue] = useState(value || '');

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let inputValue = e.target.value.replace(/\D/g, '');
		inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');

		if (inputValue.length <= 10) {
			setFormattedValue(inputValue);
			onRawChange(e);
		}
	};

	return (
		<div className={classNames(className, 'flex flex-1 w-full')}>
			<TextInput
				onRawChange={onInputChange}
				name={name}
				placeholder={DATE_FORMAT}
				value={formattedValue}
				style={{ background: theme.gray.lightest, color: theme.text }}
			/>
		</div>
	);
};
