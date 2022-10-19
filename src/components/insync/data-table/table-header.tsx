import React, { FunctionComponent, memo } from 'react';
import areEqual from 'react-fast-compare';
import { ColumnDef, SortState } from './types';
import { TableHeaderCell } from './table-header-cell';
import classNames from 'classnames';

interface Props {
	columnDefs: Array<ColumnDef>;
	setSortState: React.Dispatch<React.SetStateAction<SortState | undefined>>;
	sortState?: SortState;
}

const TableHeader: FunctionComponent<Props> = ({ columnDefs, setSortState, sortState }) => {
	return (
		<div
			className={classNames('table-header', 'h-10 grid items-center px-2 rounded-t-2xl')}
			role="header"
			style={{
				backgroundColor: '#2d2755',
				gridTemplateColumns: `repeat(24, minmax(0, 1fr))`,
			}}>
			{columnDefs.map((columnDef, i) => {
				const { canSort, headerAlign, headerStyle, header, property, width } = columnDef;

				return (
					<TableHeaderCell
						align={headerAlign}
						canSort={canSort}
						headerStyle={headerStyle}
						index={i}
						header={header}
						key={`col-${i}`}
						property={property}
						setSortState={setSortState}
						sortState={sortState}
						width={width}
					/>
				);
			})}
		</div>
	);
};

const TableHeaderMemo: FunctionComponent<Props> = memo(TableHeader, (prevProps, nextProps) => {
	return areEqual(prevProps, nextProps);
});

export { TableHeaderMemo as TableHeader };
