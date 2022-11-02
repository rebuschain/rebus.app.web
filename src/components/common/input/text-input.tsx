import classNames from 'classnames';
import React from 'react';

export type TextInputProps = {
	className?: string;
	onChange?: (name: string, value: string) => void;
	name: string;
	placeholder?: string;
	readonly?: boolean;
	style?: React.CSSProperties;
	value?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
	className,
	onChange,
	name,
	placeholder,
	readonly,
	style,
	value,
}) => {
	return (
		<input
			className={classNames(className, 'bg-white bg-opacity-10 rounded-2lg text-white text-base py-2 px-3.5 w-full')}
			disabled={readonly}
			onChange={e => onChange && onChange(name, e.target.value)}
			name={name}
			placeholder={placeholder}
			style={style}
			value={value || ''}
		/>
	);
};
