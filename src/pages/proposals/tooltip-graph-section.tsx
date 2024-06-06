import React, { FunctionComponent, useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
import { observer } from 'mobx-react-lite';

type SectionProps = {
	tooltipTitle: string;
	children: React.ReactElement<any, any>;
};
const TooltipGraphSection: FunctionComponent<React.PropsWithChildren<SectionProps>> = observer(
	({ tooltipTitle, children }) => {
		return (
			<Tooltip
				className="text-base"
				title={<span style={{ fontSize: '16px' }}>{tooltipTitle}</span>}
				placement="top"
				arrow>
				{children}
			</Tooltip>
		);
	}
);

export default TooltipGraphSection;
