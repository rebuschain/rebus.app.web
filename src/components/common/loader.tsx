import React, { FunctionComponent } from 'react';
import cn from 'clsx';
import styled from '@emotion/styled';

// TODO : implement a properly designed loader
export const Loader: FunctionComponent<React.PropsWithChildren<ILoader>> = ({ className, style }) => {
	return (
		<div className="w-full h-screen flex items-center justify-center" style={style}>
			<img
				alt="logo"
				className={cn('s-spin', className ? className : 'w-5 h-5 md:w-10 md:h-10')}
				src={'/public/assets/main/rebus-logo-single.svg'}
			/>
		</div>
	);
};

export const BigLoader = styled(Loader)`
	width: 6rem;
	height: 6rem;
	@media (min-width: 768px) {
		width: 12.5rem;
		height: 12.5rem;
	}
`;

interface ILoader {
	className?: string;
	style?: React.CSSProperties;
}
