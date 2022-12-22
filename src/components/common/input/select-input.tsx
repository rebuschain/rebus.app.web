import React, { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import Select, { ActionMeta, SingleValue, StylesConfig } from 'react-select';

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

const styles: StylesConfig<Option, false, GroupedOption> = {
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

const formatGroupLabel = (data: GroupedOption) => (
	<div className="flex items-center">
		<span>{data.label}</span>
		<span className="text-xs">&nbsp;({data.options.length})</span>
	</div>
);

export const SelectInput: React.FC<SelectInputProps> = ({
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
			styles={styles}
			value={selectedOption}
		/>
	);
};

export const SelectStyled = styled(Select)``;
