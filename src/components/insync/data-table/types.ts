import { CSSProperties, FunctionComponent } from 'react';

export type SortState = {
	property: string;
	direction: 'asc' | 'desc';
};

export type CellRendererProps<T = any, Data = Record<string, any>> = {
	data: Data;
	index: number;
	rowIndex: number;
	value: T;
};

export type ColumnDef<T = Record<string, any>> = {
	CellRenderer?: FunctionComponent<React.PropsWithChildren<CellRendererProps<any, T>>>;
	align?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
	canSort?: boolean;
	headerAlign?: 'flex-start' | 'center' | 'flex-end';
	headerStyle?: CSSProperties;
	header: string;
	hideHeaderMobile?: boolean;
	property: string;
	screenWith?: number;
	width: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
};
