import React, { FunctionComponent } from 'react';
import icons from 'src/assets/icons.svg';

type IconProps = {
	className?: string;
	icon: string;
};

const Icon: FunctionComponent<React.PropsWithChildren<IconProps>> = props => {
	return (
		<svg className={`icon icon-${props.className}`} viewBox="0 0 16 16">
			<use xlinkHref={`${icons}#icon-${props.icon}`} />
		</svg>
	);
};

export default Icon;
