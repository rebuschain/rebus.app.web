import React, { FunctionComponent } from 'react';
import MUIDataTable from 'mui-datatables';
import './index.scss';

type DataTableProps = {
	columns: any[];
	data: any[];
	name: string;
	options: any;
};

const DataTable: FunctionComponent<DataTableProps> = props => {
	return <MUIDataTable columns={props.columns} data={props.data} options={props.options} title={props.name} />;
};

export default DataTable;
