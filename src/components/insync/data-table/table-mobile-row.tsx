import React, { FunctionComponent, memo } from 'react';
import { ListChildComponentProps } from 'react-window';
import areEqual from 'react-fast-compare';
import { ColumnDef } from './types';
import classNames from 'classnames';
import { DefaultCellRenderer } from './default-cell-renderer';

interface Props extends ListChildComponentProps {
	columnDefs: Array<ColumnDef>;
	isLast?: boolean;
}

const TableMobileRow: FunctionComponent<Props> = ({ columnDefs, data, index, isLast, style }) => {
	return (
		<div
			className={classNames(`table-row-${index}`, 'grid items-center border-t px-2', isLast && 'border-b')}
			id={data.id}
			role="row"
			tabIndex={index}
			style={{
				...style,
				borderColor: 'rgba(255,255,255,.12)',
			}}>
			{columnDefs.map((columnDef, i) => {
				const { CellRenderer, align, header, property, hideHeaderMobile } = columnDef;
				const Renderer = CellRenderer || DefaultCellRenderer;
				const value = data[property];
				const parsedAlign = align || 'space-between';

				const headerStyle: React.CSSProperties = {
					color: 'rgba(255,255,255,.6)',
					fontFamily: 'Inter,ui-sans-serif,system-ui',
					fontSize: '16px',
				};

				return (
					<div
						className={classNames(
							`flex justify-between items-center w-full table-column-${i} py-3 px-5`,
							i === 0 && 'pt-5',
							i === columnDefs.length - 1 && 'pb-5'
						)}
						key={`col-${i}`}
						style={{ justifyContent: hideHeaderMobile ? parsedAlign : 'space-between' }}>
						{!hideHeaderMobile && <div style={headerStyle}>{header}</div>}
						<Renderer data={data} index={i} rowIndex={index} value={value} />
					</div>
				);
			})}
		</div>
	);
};

const TableMobileRowMemo: FunctionComponent<Props> = memo(TableMobileRow, (prevProps, nextProps) => {
	return areEqual(prevProps, nextProps);
});

export { TableMobileRowMemo as TableMobileRow };
