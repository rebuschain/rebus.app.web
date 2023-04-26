import React, { FunctionComponent, useEffect, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import { observer } from 'mobx-react-lite';

type SectionProps = {
	tooltipTitle: string;
	children: React.ReactElement<any, any>;
};
const TooltipGraphSection: FunctionComponent<SectionProps> = observer(({ tooltipTitle, children }) => {
	return (
		<Tooltip
			className="text-base"
			title={<span style={{ fontSize: '16px' }}>{tooltipTitle}</span>}
			placement="top"
			arrow>
			{children}
		</Tooltip>
	);
});

export default TooltipGraphSection;
