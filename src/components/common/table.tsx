import React, { useCallback, useEffect, useState, ReactElement } from 'react';
import styled from 'styled-components';

interface TableProps<T = any> {
	headers: string[];
	data: T[];
	loader?: ReactElement;
	loading?: boolean;
	noData?: ReactElement;
	initialSort?: { column: number; direction: 'asc' | 'desc' };
}

const TableTest: React.FC<TableProps> = ({ headers, data, initialSort, loader, loading, noData }) => {
	const [sortedData, setSortedData] = useState(data);
	const [sortConfig, setSortConfig] = useState<{ column: number; direction: 'asc' | 'desc' } | undefined>(initialSort);

	const showRows = !loading && sortedData.length > 0;
	const otherElement = <div className="flex justify-center md:px-15 md:pb-5 mt-5">{loading ? loader : noData}</div>;

	const handleSort = useCallback(
		(columnIndex: number, direction: 'asc' | 'desc') => {
			const sorted = [...sortedData].sort((a, b) => {
				const aVal = a[columnIndex];
				const bVal = b[columnIndex];

				if (!isNaN(aVal) && !isNaN(bVal)) {
					return direction === 'asc' ? aVal - bVal : bVal - aVal;
				} else {
					return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
				}
			});

			setSortedData(sorted);
			setSortConfig({ column: columnIndex, direction });
		},
		[sortedData]
	);

	useEffect(() => {
		if (initialSort) {
			handleSort(initialSort.column, initialSort.direction);
		}
	}, [initialSort, handleSort]);

	return (
		<TableStyled>
			<thead>
				<HeaderRowStyled>
					{headers.map((header, index) => (
						<HeaderStyled
							key={index}
							isFirstHeader={index === 0}
							onClick={() => handleSort(index, sortConfig?.direction === 'asc' ? 'desc' : 'asc')}>
							{header}
						</HeaderStyled>
					))}
					<LinearGradientUnderline />
				</HeaderRowStyled>
			</thead>
			{showRows ? (
				<tbody>
					{sortedData.map((row, rowIndex) => (
						<RowStyled key={rowIndex}>
							{row.map((cell: string, cellIndex: number) => (
								<CellStyled key={cellIndex} isFirstColumn={cellIndex === 0}>
									{cell}
								</CellStyled>
							))}
						</RowStyled>
					))}
				</tbody>
			) : (
				otherElement
			)}
		</TableStyled>
	);
};

const TableStyled = styled.table`
	color: ${props => props.theme.text};
	font-size: 14px;
	width: 100%;
`;

const HeaderStyled = styled.th<{ isFirstHeader?: boolean }>`
	cursor: pointer;
	font-weight: normal;
	text-align: ${props => (props.isFirstHeader ? 'left' : 'right')};
	padding: 12px;
	padding-bottom: 4px;
`;

const HeaderRowStyled = styled.tr`
	position: relative;
`;

const RowStyled = styled.tr`
	border-bottom: 1px solid ${props => props.theme.gray.dark};
`;

const LinearGradientUnderline = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 1px;
	background-image: ${props => props.theme.primary};
`;

const CellStyled = styled.td<{ isFirstColumn?: boolean }>`
	font-size: ${props => (props.isFirstColumn ? '16px' : 'inherit')};
	font-weight: ${props => (props.isFirstColumn ? '600' : 'inherit')};
	padding: 12px;
	text-align: ${props => (props.isFirstColumn ? 'left' : 'right')};
	width: ${props => (props.isFirstColumn ? '40%' : 'auto')};
`;

export default TableTest;
