import styled from '@emotion/styled';
import classNames from 'classnames';
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import useWindowSize from 'src/hooks/use-window-size';
import { TableHeader } from './table-header';
import { TableMobileRow } from './table-mobile-row';
import { TableRow } from './table-row';
import { ColumnDef, SortState } from './types';

type DataTableProps<T = any> = {
	className?: string;
	columnDefs: ColumnDef<T>[];
	data: T[];
	loader?: ReactElement;
	loading?: boolean;
	minWidth?: string;
	noData?: ReactElement;
	tableRowClassName?: string;
};

const getItemKey = (item: any) => item.id;

const EMPTY_OBJECT = {};

const DataTable: FunctionComponent<React.PropsWithChildren<DataTableProps>> = ({
	className,
	columnDefs,
	data,
	loader,
	loading,
	minWidth,
	noData,
	tableRowClassName,
}) => {
	const [sortState, setSortState] = useState<SortState>();
	const { isMobileView } = useWindowSize();

	const listRef = useRef<VariableSizeList | null>();
	const listElementRef = useRef();

	const scrollBackToTop = useCallback(() => {
		if (listRef.current) {
			try {
				listRef.current.resetAfterIndex(0);
				listRef.current.setState({ scrollOffset: 0 });
			} catch (err) {
				// ListRef is not the VariableSizeList reference
			}
		}

		if (listElementRef.current) {
			(listElementRef.current as any).parentElement.scrollTop = 0;
		}
	}, []);

	useEffect(() => {
		scrollBackToTop();
	}, [data, scrollBackToTop]);

	const sortedData = useMemo(() => {
		if (!sortState) {
			return data;
		}

		const sortRes1 = sortState.direction === 'asc' ? 1 : -1;
		const sortRes2 = sortState.direction === 'asc' ? -1 : 1;

		const newSortedData = data.slice();
		newSortedData.sort((a: any, b: any) => {
			const valueA = a[sortState.property];
			const valueB = b[sortState.property];

			if (typeof valueA === 'string') {
				const res = valueA.localeCompare(valueB);

				if (res === 0) {
					return 0;
				}

				return res >= 0 ? sortRes1 : sortRes2;
			}

			if (typeof valueA === 'number') {
				const res = valueA - valueB;

				if (res === 0) {
					return 0;
				}

				return res >= 0 ? sortRes1 : sortRes2;
			}

			const res = (valueA || '').toString().localeCompare((valueB || '').toString());

			if (res === 0) {
				return 0;
			}

			return res >= 0 ? sortRes1 : sortRes2;
		});

		return newSortedData;
	}, [data, sortState]);

	const TableRowWrapper = useMemo(
		// eslint-disable-next-line react/display-name
		() => (props: ListChildComponentProps) => (
			<TableRow
				{...props}
				columnDefs={columnDefs}
				data={sortedData[props.index]}
				isLast={props.index === sortedData.length - 1}
				tableRowClassName={tableRowClassName}
			/>
		),
		[columnDefs, sortedData, tableRowClassName]
	);

	const getRowHeight = useCallback(() => 65, []);

	const showRows = !loading && sortedData.length > 0;
	const otherElement = <div className="flex justify-center md:px-15 md:pb-5 mt-5">{loading ? loader : noData}</div>;

	if (isMobileView) {
		return (
			<div>
				{sortedData.map((item, index) => (
					<TableMobileRow
						columnDefs={columnDefs}
						data={sortedData[index]}
						key={getItemKey(item)}
						index={index}
						isLast={index === sortedData.length - 1}
						style={EMPTY_OBJECT}
					/>
				))}
			</div>
		);
	}

	return (
		<TableContainer className={classNames('flex-1 flex flex-col', className)} style={{ minWidth }}>
			<TableHeader columnDefs={columnDefs} setSortState={setSortState} sortState={sortState} />
			<div className="flex-1">
				{showRows ? (
					<AutoSizer defaultHeight={0}>
						{params => (
							<VariableSizeList
								className="list"
								height={params?.height}
								itemCount={sortedData.length}
								itemKey={getItemKey}
								itemSize={getRowHeight}
								ref={_ref => {
									listRef.current = _ref;
								}}
								width={params?.width}
								overscanCount={5}>
								{TableRowWrapper}
							</VariableSizeList>
						)}
					</AutoSizer>
				) : (
					otherElement
				)}
			</div>
		</TableContainer>
	);
};

const TableContainer = styled.div`
	.list {
		overflow-x: auto !important;
		overflow-y: scroll !important;

		& > div {
			position: relative;
		}
	}

	.list {
		@media (min-width: 768px) {
			padding-bottom: 20px;
			padding-left: 60px;
			padding-right: 45px;
		}
	}

	.table-header {
		@media (min-width: 768px) {
			margin-left: 60px;
			margin-right: 60px;
		}
	}
`;

export default DataTable;
