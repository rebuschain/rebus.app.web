import React, { FunctionComponent, memo } from 'react';
import { ListChildComponentProps } from 'react-window';
import areEqual from 'react-fast-compare';
import { ColumnDef } from './types';
import { TableColumn } from './table-column';
import classNames from 'classnames';
import useWindowSize from 'src/hooks/use-window-size';
import styled from 'styled-components';

interface Props extends ListChildComponentProps {
	columnDefs: Array<ColumnDef>;
	isLast?: boolean;
	tableRowClassName?: string;
}

const TableRow: FunctionComponent<React.PropsWithChildren<Props>> = ({
	columnDefs,
	data,
	index,
	isLast,
	style,
	tableRowClassName,
}) => {
	return (
		<RowStyled
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
				display: 'flex',
			}}>
			{columnDefs.map((columnDef, i) => {
				const { CellRenderer, property, width } = columnDef;
				const value = data[property];

				return (
					<CellStyled key={`col-${i}`} isFirstColumn={i === 0}>
						<TableColumn
							CellRenderer={CellRenderer}
							data={data}
							index={i}
							key={`col-${i}`}
							rowIndex={index}
							value={value}
							width={width}
						/>
					</CellStyled>
				);
			})}
		</RowStyled>
	);
};

const RowStyled = styled.tr`
	border-bottom: 1px solid ${props => props.theme.gray.dark};
`;

const CellStyled = styled.div<{ isFirstColumn?: boolean }>`
	font-size: ${props => (props.isFirstColumn ? '16px' : 'inherit')};
	font-weight: ${props => (props.isFirstColumn ? '600' : 'inherit')};
	padding: 12px;
	text-align: ${props => (props.isFirstColumn ? 'left' : 'right')};
	width: ${props => (props.isFirstColumn ? '40%' : 'auto')};
`;

const TableRowMemo: FunctionComponent<React.PropsWithChildren<Props>> = memo(TableRow, (prevProps, nextProps) => {
	return areEqual(prevProps, nextProps);
});

export { TableRowMemo as TableRow };
