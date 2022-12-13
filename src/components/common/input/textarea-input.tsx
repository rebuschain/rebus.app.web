import classNames from 'classnames';
import React, { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';

export type TextareaInputProps = {
	className?: string;
	onClick?: MouseEventHandler<HTMLTextAreaElement>;
	onChange?: (name: string, value: string) => void;
	onRawChange?: ChangeEventHandler<HTMLTextAreaElement>;
	maxLength?: number;
	name?: string;
	placeholder?: string;
	readonly?: boolean;
	resize?: 'none' | 'both' | 'horizontal' | 'vertical';
	rows?: number;
	style?: React.CSSProperties;
	value?: string;
};

export const TextareaInput: React.FC<React.PropsWithChildren<TextareaInputProps>> = ({
	className,
	onClick,
	onChange,
	onRawChange,
	maxLength,
	name = '',
	placeholder,
	readonly,
	rows,
	style,
	value,
}) => {
	return (
		<textarea
			className={classNames(className, 'bg-white bg-opacity-10 rounded-2lg text-white text-base py-2 px-3.5 w-full')}
			disabled={readonly}
			onClick={onClick}
			onChange={e => {
				if (onRawChange) {
					onRawChange(e);
				}

				if (onChange) {
					onChange(name, maxLength ? e.target.value.slice(0, maxLength) : e.target.value);
				}
			}}
			maxLength={maxLength}
			name={name}
			placeholder={placeholder}
			rows={rows}
			style={{
				...(style || {}),
				resize: 'none',
			}}
			value={value || ''}
		/>
	);
};
