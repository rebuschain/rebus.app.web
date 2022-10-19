import React, { FunctionComponent, memo } from 'react';
import { ListChildComponentProps } from 'react-window';
import areEqual from 'react-fast-compare';
import { ColumnDef } from './types';
import { TableColumn } from './table-column';
import classNames from 'classnames';
import useWindowSize from 'src/hooks/use-window-size';

interface Props extends ListChildComponentProps {
	columnDefs: Array<ColumnDef>;
	isLast?: boolean;
	tableRowClassName?: string;
}

const TableRow: FunctionComponent<Props> = ({ columnDefs, data, index, isLast, style, tableRowClassName }) => {
	return (
		<div
			className={classNames(
				`table-row-${index}`,
				'grid items-center border-t px-2',
				isLast && 'border-b',
				tableRowClassName
			)}
			id={data.id}
			role="row"
			tabIndex={index}
			style={{
				...style,
				borderColor: 'rgba(255,255,255,.12)',
				gridTemplateColumns: `repeat(24, minmax(0, 1fr))`,
			}}>
			{columnDefs.map((columnDef, i) => {
				const { CellRenderer, align, property, width } = columnDef;
				const value = data[property];

				return (
					<TableColumn
						CellRenderer={CellRenderer}
						align={align}
						data={data}
						index={i}
						key={`col-${i}`}
						rowIndex={index}
						value={value}
						width={width}
					/>
				);
			})}
		</div>
	);
};

const TableRowMemo: FunctionComponent<Props> = memo(TableRow, (prevProps, nextProps) => {
	return areEqual(prevProps, nextProps);
});

export { TableRowMemo as TableRow };
