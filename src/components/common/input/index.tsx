import React from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { DateInput, DateInputProps } from './date-input';
import { FileInput, FileInputProps } from './file-input';
import { SelectInput, SelectInputProps } from './select-input';
import { TextInput, TextInputProps } from './text-input';
import { Media } from 'src/types/nft-id';
import { TextareaInput, TextareaInputProps } from './textarea-input';

export enum InputTypes {
	Date = 'date',
	File = 'file',
	Select = 'select',
	Text = 'text',
	Textarea = 'textarea',
}

export interface InputProps
	extends Omit<TextInputProps, 'onChange' | 'onRawChange' | 'onClick' | 'value'>,
		Omit<DateInputProps, 'onChange' | 'value'>,
		Omit<FileInputProps, 'onChange' | 'value'>,
		Omit<SelectInputProps, 'onChange' | 'value'>,
		Omit<TextareaInputProps, 'onChange' | 'onRawChange' | 'onClick' | 'value'> {
	className?: string;
	hide?: boolean;
	label?: string;
	onChange?:
		| TextInputProps['onChange']
		| DateInputProps['onChange']
		| FileInputProps['onChange']
		| SelectInputProps['onChange']
		| TextareaInputProps['onChange'];
	onClick?: TextInputProps['onClick'] | TextareaInputProps['onClick'];
	onRawChange?: TextInputProps['onRawChange'] | TextareaInputProps['onRawChange'];
	onVisibilityChange: (name: string, value: boolean) => void;
	style?: React.CSSProperties;
	type?: InputTypes;
	value?: string | Media;
	width?: string;
}

export const Input: React.FC<InputProps> = ({
	backgroundSize,
	className,
	hide,
	label,
	maxLength,
	name = '',
	onChange,
	onVisibilityChange,
	options,
	placeholder,
	useGrayscale,
	rows,
	style,
	type,
	value,
	width = 'w-full',
}) => {
	let content = null;

	switch (type) {
		case InputTypes.Date:
			content = (
				<DateInput onChange={onChange as DateInputProps['onChange']} name={name} value={value as string | undefined} />
			);
			break;
		case InputTypes.File:
			content = (
				<FileInput
					backgroundSize={backgroundSize}
					onChange={onChange as FileInputProps['onChange']}
					name={name}
					placeholder={placeholder}
					useGrayscale={useGrayscale}
					value={value as Media | undefined}
				/>
			);
			break;
		case InputTypes.Select:
			content = (
				<SelectInput
					onChange={onChange as SelectInputProps['onChange']}
					name={name}
					options={options}
					value={value as string | undefined}
				/>
			);
			break;
		case InputTypes.Textarea:
			content = (
				<TextareaInput
					onChange={onChange as TextareaInputProps['onChange']}
					maxLength={maxLength}
					name={name}
					placeholder={placeholder}
					rows={rows}
					value={value as string | undefined}
				/>
			);
			break;
		default:
			content = (
				<TextInput
					onChange={onChange as TextInputProps['onChange']}
					name={name}
					placeholder={placeholder}
					value={value as string | undefined}
				/>
			);
			break;
	}

	return (
		<div className={classNames(className, width)} style={style}>
			{label && (
				<div className="flex items-center mb-2">
					<label className="block text-xs font-bold gray-6 opacity-60 uppercase">{label}</label>
					<button className="ml-2" onClick={() => onVisibilityChange(name, !hide)}>
						<ReactSVG src={hide ? '/public/assets/icons/hidden.svg' : '/public/assets/icons/visible.svg'} />
					</button>
				</div>
			)}

			<div>{content}</div>
		</div>
	);
};
