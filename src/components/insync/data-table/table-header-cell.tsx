import React, { FunctionComponent } from 'react';
import { ColumnDef, SortState } from './types';
import useWindowSize from 'src/hooks/use-window-size';
import styled from 'styled-components';

type Props = {
	align?: ColumnDef['align'];
	canSort?: boolean;
	header: string;
	headerStyle?: React.CSSProperties;
	index: number;
	property: string;
	setSortState: React.Dispatch<React.SetStateAction<SortState | undefined>>;
	sortState?: SortState;
	width: ColumnDef['width'];
};

const TableHeaderCell: FunctionComponent<React.PropsWithChildren<Props>> = ({
	align,
	canSort,
	index,
	header,
	headerStyle,
	property,
	setSortState,
	sortState,
	width,
}) => {
	const { windowSize } = useWindowSize();
	const style: React.CSSProperties = {
		color: 'rgba(255,255,255,.6)',
		fontFamily: 'Inter,ui-sans-serif,system-ui',
		fontSize: windowSize.width < 968 ? '12px' : '14px',
		height: '100%',
		justifyContent: align,
		gridColumn: `span ${width}`,
		padding: '0',
		paddingLeft: '4px',
		paddingRight: '4px',
		lineHeight: '18px',
		textTransform: 'initial',
		...(headerStyle || {}),
	};
	if (!canSort) {
		return (
			<div className={`flex items-center table-header-cell-${index}`} style={style}>
				{header}
			</div>
		);
	}

	const isSorted = property === sortState?.property;
	const isAscending = sortState?.direction === 'asc';

	const onClick = () => {
		if (isSorted) {
			if (!isAscending) {
				setSortState(undefined);
			} else {
				setSortState({
					property,
					direction: isAscending ? 'desc' : 'asc',
				});
			}
		} else {
			setSortState({
				property,
				direction: 'asc',
			});
		}
	};

	return (
		<HeaderStyled key={index} isFirstHeader={index === 0} onClick={onClick} align={align}>
			{header}
		</HeaderStyled>
	);
};

const HeaderStyled = styled.div<{ isFirstHeader?: boolean; align?: string }>`
	cursor: pointer;
	font-weight: normal;
	justify-content: ${props => props.align};
	padding: 12px;
	padding-bottom: 4px;
`;

export { TableHeaderCell };
