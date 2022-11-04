import classNames from 'classnames';
import React from 'react';

type DataItemProps = {
	className?: string;
	isBlurred?: boolean;
	label?: string;
	value?: string;
};

export const DataItem: React.FC<DataItemProps> = ({ children, className, isBlurred, label, value }) => {
	return (
		<div className={classNames(className, 'flex flex-col')}>
			{label && (
				<div className="text-xs font-bold uppercase opacity-60" style={{ lineHeight: '14px' }}>
					{label}
				</div>
			)}
			<div
				className="text-xl gray-6 font-bold"
				style={{ filter: isBlurred ? 'blur(7.5px)' : undefined, lineHeight: '28px' }}>
				{value || children}
			</div>
		</div>
	);
};
