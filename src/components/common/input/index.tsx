import React from 'react';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import { DobInput, DobInputProps } from './dob-input';
import { FileInput, FileInputProps } from './file-input';
import { TextInput, TextInputProps } from './text-input';
import { Media } from 'src/types/nft-id';

export enum InputTypes {
	DateOfBirth = 'dateOfBirth',
	FileInput = 'fileInput',
	Text = 'text',
}

export interface InputProps
	extends Omit<TextInputProps, 'onChange' | 'value'>,
		Omit<DobInputProps, 'onChange' | 'value'>,
		Omit<FileInputProps, 'onChange' | 'value'> {
	className?: string;
	hide?: boolean;
	label?: string;
	onChange?: TextInputProps['onChange'] | DobInputProps['onChange'] | FileInputProps['onChange'];
	onVisibilityChange: (name: string, value: boolean) => void;
	style?: React.CSSProperties;
	type?: InputTypes;
	value?: string | Media;
	width?: string;
}

export const Input: React.FC<InputProps> = ({
	className,
	hide,
	label,
	name,
	onChange,
	onVisibilityChange,
	placeholder,
	style,
	type,
	value,
	width = 'w-full',
}) => {
	let content = null;

	switch (type) {
		case InputTypes.DateOfBirth:
			content = (
				<DobInput onChange={onChange as DobInputProps['onChange']} name={name} value={value as string | undefined} />
			);
			break;
		case InputTypes.FileInput:
			content = (
				<FileInput
					onChange={onChange as FileInputProps['onChange']}
					name={name}
					placeholder={placeholder}
					value={value as Media | undefined}
				/>
			);
			break;
		default:
			content = (
				<TextInput
					onChange={onChange as DobInputProps['onChange']}
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
