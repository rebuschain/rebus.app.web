import classNames from 'classnames';
import React, { useState } from 'react';
import { Theme } from 'src/types/nft-id';

type ColorOption = {
	name: string;
	colors: string[];
};

type ColorPickerProps = {
	className?: string;
	onChange: (theme: Theme) => void;
	options: ColorOption[];
	value: ColorOption;
};

const getLinearGradient = (colors: string[]) => `linear-gradient(120deg, ${colors.join(', ')})`;

export const ColorPicker: React.FC<React.PropsWithChildren<ColorPickerProps>> = ({
	className,
	onChange,
	options,
	value,
}) => {
	return (
		<div className={classNames(className, 'relative')}>
			<h5 className="whitespace-nowrap mb-6">Color Theme</h5>

			<div className="flex items-center flex-wrap">
				{options.map(option => (
					<div
						className={classNames(
							'flex items-center bg-black bg-opacity-30 py-2.5 px-3.5 cursor-pointer mr-2.5 mb-2.5 border-2 border-opacity-30',
							value.name === option.name && 'border-white',
							value.name !== option.name && 'border-transparent'
						)}
						key={option.name}
						onClick={() => onChange(option)}
						style={{ borderRadius: '45px' }}>
						<div
							className="flex items-center justify-center rounded-full"
							style={{ background: getLinearGradient(option.colors), height: '32px', width: '32px' }}>
							{value.name === option.name && <img src="/public/assets/icons/checkmark.svg" />}
						</div>
						<div className="white font-bold text-lg ml-2">{option.name}</div>
					</div>
				))}
			</div>
		</div>
	);
};
