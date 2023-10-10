import React, { FunctionComponent } from 'react';
import { DefaultCellRenderer } from './default-cell-renderer';
import { ColumnDef } from './types';
import styled from 'styled-components';

type Props = {
	CellRenderer: ColumnDef['CellRenderer'];
	data: Record<string, any>;
	index: number;
	rowIndex: number;
	value: any;
	width: ColumnDef['width'];
};

const TableColumn: FunctionComponent<React.PropsWithChildren<Props>> = ({
	CellRenderer,
	data,
	index,
	rowIndex,
	value,
	width,
}) => {
	const Renderer = CellRenderer || DefaultCellRenderer;

	return (
		<div className={`flex table-column-${index} px-1`} style={{ gridColumn: `span ${width}` }}>
			<Renderer data={data} index={rowIndex} rowIndex={rowIndex} value={value} />
		</div>
	);
};

export { TableColumn };
