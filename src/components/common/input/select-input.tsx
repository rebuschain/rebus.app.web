import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { DefaultTheme, useTheme } from 'styled-components';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';
import { hexToRgb } from 'src/colors';

export type Option = {
	label: string;
	value: string;
};

export interface GroupedOption {
	readonly label: string;
	readonly options: readonly Option[];
}

export type SelectInputProps = {
	className?: string;
	onChange?: (name: string, value: string) => void;
	name?: string;
	options?: Option[] | GroupedOption[];
	placeholder?: string;
	value?: string;
};

const styles = (theme: DefaultTheme): StylesConfig<Option, false, GroupedOption> => ({
	clearIndicator: styles => ({ ...styles, color: theme.text, cursor: 'pointer !important' }),
	control: styles => ({
		...styles,
		backgroundColor: theme.gray.lightest,
		border: 'none',
		borderRadius: 10,
		boxShadow: 'none',
		cursor: 'text',
	}),
	dropdownIndicator: styles => ({ ...styles, color: theme.text, cursor: 'pointer !important' }),
	option: (styles, { isFocused, isSelected }) => {
		return {
			...styles,
			backgroundColor: isFocused || isSelected ? theme.gray.lightest : 'transparent !important',
			cursor: 'pointer !important',
		};
	},
	input: styles => ({ ...styles, color: theme.text }),
	menu: styles => ({ ...styles, backgroundColor: theme.gray.lighter }),
	placeholder: styles => ({ ...styles, color: `${hexToRgb(theme.text, 0.5)}` }),
	singleValue: (styles, { data }) => ({ ...styles, color: theme.text }),
	valueContainer: styles => ({ ...styles, padding: '4px 12px' }),
});

const formatGroupLabel = (data: GroupedOption) => (
	<div className="flex items-center">
		<span>{data.label}</span>
		<span className="text-xs">&nbsp;({data.options.length})</span>
	</div>
);

export const SelectInput: React.FC<React.PropsWithChildren<SelectInputProps>> = ({
	className,
	onChange,
	name = '',
	options,
	placeholder,
	value,
}) => {
	const selectedOption = useMemo(() => {
		let _selectedOption: Option | null = null;

		(options as Option[])?.find((option: unknown) => {
			const groupedOption = option as GroupedOption;
			const normalOption = option as Option;

			if (groupedOption.options) {
				const selected = groupedOption.options.find(subOption => subOption.value === value);

				if (selected) {
					_selectedOption = selected;
				}
			} else if (normalOption.value === value) {
				_selectedOption = normalOption;
			}

			return _selectedOption;
		});

		return _selectedOption;
	}, [options, value]);

	const innerOnChange = useCallback(
		(singleValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
			if (onChange) {
				onChange(name, singleValue?.value || '');
			}
		},
		[name, onChange]
	);

	const theme = useTheme();
	const themedStyles = styles(theme);

	return (
		<Select<Option, false, GroupedOption>
			className={className}
			formatGroupLabel={formatGroupLabel}
			isClearable={true}
			isSearchable={true}
			name={name}
			onChange={innerOnChange}
			options={options}
			placeholder={placeholder}
			styles={themedStyles}
			value={selectedOption}
		/>
	);
};

export const SelectStyled = styled(Select)``;
