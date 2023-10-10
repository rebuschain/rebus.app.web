import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

export const OverviewLabelValue: FunctionComponent<React.PropsWithChildren<Record<'label', string>>> = ({
	label,
	children,
}) => {
	return (
		<TextStyled>
			<div className="flex flex-col">
				<p className="mb-2.5 md:mb-3 text-sm md:text-base whitespace-nowrap">{label}</p>
				{children}
			</div>
		</TextStyled>
	);
};

const TextStyled = styled.p`
	color: ${props => props.theme.text};
`;
