import React, { FunctionComponent } from 'react';
import { CellRendererProps } from './types';

const DefaultCellRenderer: FunctionComponent<React.PropsWithChildren<CellRendererProps<string>>> = ({ value }) => (
	<div>{value}</div>
);

export { DefaultCellRenderer };
