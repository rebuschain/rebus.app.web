import classNames from 'classnames';
import React from 'react';
import { Theme } from 'src/types/nft-id';
import { styled } from 'styled-components';
import { Button } from '../common/button';

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
		<ColorPickerStyled className={classNames(className, 'relative')}>
			<h5 className="whitespace-nowrap mb-6">Color Theme</h5>

			<div className="flex items-center flex-wrap">
				{options.map(option => (
					<Button
						key={option.name}
						backgroundStyle="secondary"
						onClick={() => onChange(option)}
						style={{ margin: '2px', minWidth: '150px', display: 'flex', alignItems: 'center', position: 'relative' }}>
						{
							<>
								<div
									className="flex items-center justify-center rounded-full"
									style={{
										background: getLinearGradient(option.colors),
										height: '32px',
										width: '32px',
										position: 'absolute',
										left: '32px',
									}}
								/>
								<span style={{ position: 'absolute', left: '70px' }}>{option.name}</span>
							</>
						}
					</Button>
				))}
			</div>
		</ColorPickerStyled>
	);
};

const ColorPickerStyled = styled.div`
	color: ${props => props.theme.text};
`;
