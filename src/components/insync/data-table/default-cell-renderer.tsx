import React, { FunctionComponent } from 'react';
import { CellRendererProps } from './types';

const DefaultCellRenderer: FunctionComponent<CellRendererProps<string>> = ({ value }) => <div>{value}</div>;

export { DefaultCellRenderer };
