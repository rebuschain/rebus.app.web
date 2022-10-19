import React, { FunctionComponent } from 'react';
import { DefaultCellRenderer } from './default-cell-renderer';
import { ColumnDef } from './types';

type Props = {
	CellRenderer: ColumnDef['CellRenderer'];
	align?: ColumnDef['align'];
	data: Record<string, any>;
	index: number;
	rowIndex: number;
	value: any;
	width: ColumnDef['width'];
};

const TableColumn: FunctionComponent<Props> = ({ CellRenderer, align, data, index, rowIndex, value, width }) => {
	const Renderer = CellRenderer || DefaultCellRenderer;

	return (
		<div className={`flex table-column-${index} px-1`} style={{ justifyContent: align, gridColumn: `span ${width}` }}>
			<Renderer data={data} index={rowIndex} rowIndex={rowIndex} value={value} />
		</div>
	);
};

export { TableColumn };
