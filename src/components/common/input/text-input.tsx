import classNames from 'classnames';
import React, { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';

export type TextInputProps = {
	className?: string;
	onClick?: MouseEventHandler<HTMLInputElement>;
	onChange?: (name: string, value: string) => void;
	onRawChange?: ChangeEventHandler<HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	name?: string;
	placeholder?: string;
	readonly?: boolean;
	style?: React.CSSProperties;
	value?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
	className,
	onClick,
	onChange,
	onRawChange,
	onKeyDown,
	name = '',
	placeholder,
	readonly,
	style,
	value,
}) => {
	return (
		<input
			className={classNames(className, 'bg-white bg-opacity-10 rounded-2lg text-white text-base py-2 px-3.5 w-full')}
			disabled={readonly}
			onClick={onClick}
			onChange={e => {
				if (onRawChange) {
					onRawChange(e);
				}

				if (onChange) {
					onChange(name, e.target.value);
				}
			}}
			onKeyDown={onKeyDown}
			name={name}
			placeholder={placeholder}
			style={style}
			value={value || ''}
		/>
	);
};
