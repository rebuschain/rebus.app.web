import React, { FunctionComponent } from 'react';
import MUIDataTable from 'mui-datatables';
import styled from '@emotion/styled';

type DataTableProps = {
	columns: any[];
	data: any[];
	name: string;
	options: any;
};

const DataTable: FunctionComponent<DataTableProps> = props => {
	return <MUIDataTableStyled columns={props.columns} data={props.data} options={props.options} title={props.name} />;
};

const MUIDataTableStyled = styled(MUIDataTable)`
	background-color: transparent !important;
	box-shadow: unset !important;

	button.view_all {
		color: #ffffff;
	}

	table {
		border-collapse: collapse;
		border-spacing: 0 5px;
	}

	div[aria-label='Table Toolbar'] {
		display: none;
	}

	thead th {
		border-bottom: unset;
		padding: 0 10px;
		text-align: center;
		background-color: #2d2755;
	}

	thead th:nth-child(1) {
		border-top-left-radius: 1rem;
		padding-left: 30px;
	}

	thead th:last-child {
		border-top-right-radius: 1rem;
		padding-right: 30px;
	}

	thead th > span {
		justify-content: center;
	}

	th button,
	thead th > div {
		font-family: Inter, ui-sans-serif, system-ui;
		font-weight: 400;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.6);
		margin: auto;
		width: max-content;
		text-align: center;
	}

	th button div {
		color: rgba(255, 255, 255, 0.6);
	}

	th button svg {
		fill: rgba(255, 255, 255, 0.6);
	}

	th button > span > div > div:last-child {
		display: flex;
		align-items: center;
	}

	tbody tr td {
		border: unset;
		margin-bottom: 10px;
		padding: 12px;
		border-color: #ffff;
	}

	tbody tr td > div {
		text-align: center;
		font-family: Inter, ui-sans-serif, system-ui;
		font-size: 16px;
		color: rgba(255, 255, 255, 0.6);
	}

	tr {
		border-color: rgba(255, 255, 255, 0.12);
		border-style: solid;
		border-bottom-width: 1px;
	}

	tbody tr td[colspan='6'] {
		border-radius: 50px;
	}

	@media (max-width: 958px) {
		table {
			border-spacing: 0 10px;
			margin-top: unset;
		}

		tbody tr td {
			padding: 12px 20px;
			margin-bottom: -1px;
			border-radius: unset;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		tbody tr td > div {
			text-align: left;
		}

		tbody tr td > div:last-child {
			text-align: right;
		}

		tbody tr td:first-child {
			border-radius: 10px 10px 0 0;
		}

		tbody tr td:last-child {
			border-radius: 0 0 10px 10px;
		}

		tbody tr td:first-child > div:first-child,
		tbody tr td:last-child > div:first-child {
			display: none;
		}

		tbody tr td:first-child > div:nth-child(2),
		tbody tr td:last-child > div:nth-child(2) {
			width: 100%;
		}
	}

	@media (max-width: 426px) {
		table {
			width: 100%;
		}
		table tbody,
		table tbody tr,
		tbody tr td {
			width: 100%;
		}

		tbody tr td > div {
			width: auto;
		}
	}
`;

export default DataTable;
