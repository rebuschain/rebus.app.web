import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';

export type Option = {
	label: string;
	value: string;
};

export type SelectInputProps = {
	className?: string;
	onChange?: (name: string, value: string) => void;
	name?: string;
	options?: Option[];
	placeholder?: string;
	value?: string;
};

const styles: StylesConfig<Option> = {
	clearIndicator: styles => ({ ...styles, color: 'white !important', cursor: 'pointer !important' }),
	control: styles => ({
		...styles,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		border: 'none',
		borderRadius: 10,
		boxShadow: 'none',
		cursor: 'text',
	}),
	dropdownIndicator: styles => ({ ...styles, color: 'white !important', cursor: 'pointer !important' }),
	option: (styles, { isFocused, isSelected }) => {
		return {
			...styles,
			backgroundColor: isFocused || isSelected ? 'rgba(255, 255, 255, 0.1) !important' : 'transparent !important',
			cursor: 'pointer !important',
		};
	},
	input: styles => ({ ...styles, color: 'white !important' }),
	menu: styles => ({ ...styles, backgroundColor: '#2D3D77' }),
	placeholder: styles => ({ ...styles, color: 'rgba(255, 255, 255, 0.5)' }),
	singleValue: (styles, { data }) => ({ ...styles, color: 'white !important' }),
	valueContainer: styles => ({ ...styles, padding: '4px 12px' }),
};

export const SelectInput: React.FC<SelectInputProps> = ({
	className,
	onChange,
	name = '',
	options,
	placeholder,
	value,
}) => {
	const selectedOption = options?.find(option => option.value === value) || null;

	const innerOnChange = useCallback(
		(singleValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
			if (onChange) {
				onChange(name, singleValue?.value || '');
			}
		},
		[name, onChange]
	);

	return (
		<Select<Option>
			className={className}
			isClearable={true}
			isSearchable={true}
			name={name}
			onChange={innerOnChange}
			options={options}
			placeholder={placeholder}
			styles={styles}
			value={selectedOption}
		/>
	);
};

export const SelectStyled = styled(Select)``;
