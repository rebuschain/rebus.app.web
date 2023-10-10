import React, { FunctionComponent, memo } from 'react';
import areEqual from 'react-fast-compare';
import { ColumnDef, SortState } from './types';
import { TableHeaderCell } from './table-header-cell';
import classNames from 'classnames';
import styled from 'styled-components';

interface Props {
	columnDefs: Array<ColumnDef>;
	setSortState: React.Dispatch<React.SetStateAction<SortState | undefined>>;
	sortState?: SortState;
}

const TableHeader: FunctionComponent<React.PropsWithChildren<Props>> = ({ columnDefs, setSortState, sortState }) => {
	return (
		<div
			className={classNames('table-header', 'h-10 grid items-center px-2 rounded-t-2xl')}
			role="header"
			style={{
				position: 'relative',
				display: 'flex',
			}}>
			{columnDefs.map((columnDef, i) => {
				const { canSort, headerAlign, header, property, width } = columnDef;

				const alignmentStyle = i === 0 ? true : false;

				return (
					<HeaderCellContainer key={`col-${i}`} isFirstHeader={alignmentStyle}>
						<TableHeaderCell
							align={headerAlign}
							canSort={canSort}
							index={i}
							header={header}
							key={`col-${i}`}
							property={property}
							setSortState={setSortState}
							sortState={sortState}
							width={width}
						/>
						<LinearGradientUnderline />
					</HeaderCellContainer>
				);
			})}
		</div>
	);
};

const HeaderCellContainer = styled.div<{ isFirstHeader?: boolean }>`
	justify-content: ${props => (props.isFirstHeader ? 'flex-start' : 'flex-end')};
`;

const LinearGradientUnderline = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 1px;
	background-image: ${props => props.theme.primary};
`;

const TableHeaderMemo: FunctionComponent<React.PropsWithChildren<Props>> = memo(TableHeader, (prevProps, nextProps) => {
	return areEqual(prevProps, nextProps);
});

export { TableHeaderMemo as TableHeader };
