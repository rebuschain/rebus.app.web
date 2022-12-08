import classNames from 'classnames';
import React, { useCallback } from 'react';
import { TextInput } from './text-input';
import styled from '@emotion/styled';
import DatePicker from '@mui/lab/DatePicker';
import { TextFieldProps } from '@mui/material';

export type DateInputProps = {
	className?: string;
	onChange: (name: string, value: string) => void;
	name?: string;
	value?: string;
};

const DATE_FORMAT = 'MM/DD/YYYY';

const TextFieldComponent: React.ComponentType<TextFieldProps> = ({ onChange, InputProps, value }) => {
	return (
		<div className="relative">
			<TextInput onRawChange={onChange} placeholder={DATE_FORMAT} value={(value as string) || ''} />
			<EndAdormentContainer className="absolute right-0 top-5">{InputProps?.endAdornment}</EndAdormentContainer>
		</div>
	);
};

export const DateInput: React.FC<DateInputProps> = ({ className, onChange, name = '', value }) => {
	const onDateChange = useCallback(date => onChange(name, date?.format(DATE_FORMAT) || ''), [name, onChange]);

	return (
		<div className={classNames(className, 'flex flex-1 w-full')}>
			<DatePicker
				disableFuture
				format={DATE_FORMAT}
				value={value || null}
				onChange={onDateChange}
				TextFieldComponent={TextFieldComponent}
			/>
		</div>
	);
};

const EndAdormentContainer = styled.div`
	svg {
		color: white;
	}
`;
