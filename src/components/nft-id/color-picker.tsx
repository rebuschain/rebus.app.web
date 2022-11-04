import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { useClickOutside } from 'src/hooks/use-click-outside';
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

export const ColorPicker: React.FC<ColorPickerProps> = ({ className, onChange, options, value }) => {
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useClickOutside(() => isOpen && setIsOpen(false));

	return (
		<div className={classNames(className, 'relative')}>
			<button
				className={classNames(
					'bg-white flex items-center px-3 rounded-tl-2lg rounded-tr-2lg',
					!isOpen && 'rounded-bl-2lg rounded-br-2lg'
				)}
				onClick={() => setIsOpen(!isOpen)}>
				<div className="text-left black mr-2" style={{ width: '44px' }}>
					{value.name}
				</div>

				<div className="flex">
					{value.colors.map((color, index) => (
						<div
							className="rounded-full mr-2 border border-black"
							key={index}
							style={{ background: color, height: '16px', width: '16px' }}
						/>
					))}
				</div>

				<img
					className="ml-1"
					src={`/public/assets/icons/dropdown-arrow.svg`}
					style={{ transform: isOpen ? undefined : 'rotate(180deg)', width: '12px' }}
				/>
			</button>

			{isOpen && (
				<div
					className="absolute black bg-white rounded-br-2lg rounded-bl-2lg w-full shadow-lg border border-black"
					ref={modalRef}
					style={{ zIndex: 10 }}>
					{options.map((option, optionIndex) => (
						<button
							className={classNames(
								'flex flex-col items-center pt-1 pb-3 w-full border-black hover:bg-gray-300',
								value.name === option.name && 'bg-gray-200',
								optionIndex !== 0 && 'border-t',
								optionIndex === options.length - 1 && 'rounded-br-2lg rounded-bl-2lg'
							)}
							key={option.name}
							onClick={() => {
								onChange(option);
								setIsOpen(false);
							}}>
							<div>{option.name}</div>
							<div className="flex items-center">
								{option.colors.map((color, index) => (
									<div
										className="rounded-full mr-2 border border-black"
										key={index}
										style={{ background: color, height: '16px', width: '16px' }}
									/>
								))}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
