import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { MUIDataTableColumnDef, MUIDataTableMeta } from 'mui-datatables';
import classNames from 'classnames';
import DataTable from 'src/components/insync/DataTable';
import CircularProgress from 'src/components/insync/CircularProgress';
import { useStore } from 'src/stores';
import { formatCount } from 'src/utils/numberFormats';
import { config } from 'src/config-insync';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { useAddress } from 'src/hooks/useAddress';
import UnDelegateButton from '../Home/TokenDetails/UnDelegateButton';
import ReDelegateButton from '../Home/TokenDetails/ReDelegateButton';
import DelegateButton from './DelegateButton';
import ValidatorName from './ValidatorName';
import './index.scss';

const ValidatorCell = (value: any, tableMeta: MUIDataTableMeta) => (
	<ValidatorName
		index={tableMeta && tableMeta.rowIndex}
		name={value}
		value={tableMeta.rowData && tableMeta.rowData.length && tableMeta.rowData[1]}
	/>
);

const StatusCell = (value: any) => (
	<div
		className={classNames('status', value.jailed ? 'red_status' : '', value.status !== 3 ? 'unbonded' : '')}
		title={value.status === 1 ? 'Unbonded' : value.status === 2 ? 'Unbonding' : value.status === 3 ? 'Active' : ''}>
		{value.status === 1 ? 'Unbonded' : value.status === 2 ? 'Unbonding' : value.status === 3 ? 'Active' : ''}
	</div>
);

const VotingPowerCell = (value: any) => (
	<div className="voting_power">
		<p>{formatCount(value, true)}</p>
	</div>
);

const VotingPercentageCell = (value: any) => (
	<div className="voting_percentage">
		<p>{value}%</p>
	</div>
);

const CommissionCell = (value: any) => (value ? value + '%' : '0%');

const TokensStakedCell = (item: any) => {
	let value = item.delegations.find(
		(val: any) => (val.delegation && val.delegation.validator_address) === item.operator_address
	);
	value = value ? value.balance && value.balance.amount && value.balance.amount / 10 ** config.COIN_DECIMALS : null;

	return <div className={value ? 'tokens' : 'no_tokens'}>{value || 'no tokens'}</div>;
};

const ActionCell = ({ delegations, operator_address: validatorAddress }: any) =>
	delegations.find((item: any) => (item.delegation && item.delegation.validator_address) === validatorAddress) ? (
		<div className="actions">
			<ReDelegateButton valAddress={validatorAddress} />
			<span />
			<UnDelegateButton valAddress={validatorAddress} />
			<span />
			<DelegateButton valAddress={validatorAddress} />
		</div>
	) : (
		<div className="actions">
			<DelegateButton valAddress={validatorAddress} />
		</div>
	);

const columns: MUIDataTableColumnDef[] = [
	{
		name: 'validator',
		label: 'Validator',
		options: {
			sort: true,
			customBodyRender: ValidatorCell,
		},
	},
	{
		name: 'status',
		label: 'Status',
		options: {
			sort: false,
			customBodyRender: StatusCell,
		},
	},
	{
		name: 'voting_power',
		label: 'Voting Power',
		options: {
			sort: true,
			customBodyRender: VotingPowerCell,
		},
	},
	{
		name: 'voting_percentage',
		label: 'Voting Percentage',
		options: {
			sort: true,
			customBodyRender: VotingPercentageCell,
		},
	},
	{
		name: 'commission',
		label: 'Commission',
		options: {
			sort: true,
			customBodyRender: CommissionCell,
		},
	},
	{
		name: 'tokens_staked',
		label: 'Tokens Staked',
		options: {
			sort: false,
			customBodyRender: TokensStakedCell,
		},
	},
	{
		name: 'action',
		label: 'Action',
		options: {
			sort: false,
			customBodyRender: ActionCell,
		},
	},
];

type TableProps = {
	active: number;
};

const selector = (state: any) => {
	return {
		lang: state.language,
		validatorList: state.stake.validators.list,
		inProgress: state.stake.validators.inProgress,
		delegatedValidatorList: state.stake.delegatedValidators.list,
	};
};

const Table = observer<TableProps>(({ active }) => {
	const { delegatedValidatorList, inProgress, validatorList } = useAppSelector(selector);

	const { chainStore, queriesStore } = useStore();
	const address = useAddress();
	const bondedTokens = queriesStore.get(chainStore.current.chainId).cosmos.queryPool.response?.data.result
		.bonded_tokens;
	const delegations =
		queriesStore.get(chainStore.current.chainId).rebus.queryDelegations.get(address).response?.data?.result || [];

	const tableData = useMemo(() => {
		let dataToMap = active === 2 ? delegatedValidatorList : validatorList;

		if (active === 3 && dataToMap) {
			// Inactive validators
			dataToMap = dataToMap.filter((item: any) => item.status !== 3);
		} else if (active === 1 && dataToMap) {
			// Active validators
			dataToMap = dataToMap.filter((item: any) => item.status === 3);
		}

		return dataToMap && dataToMap.length
			? dataToMap.map((item: any) => {
					const parsedItem = { ...item, delegations };

					const bondedTokensNumber = Number(bondedTokens) || 0;
					const votingPercentage =
						bondedTokensNumber === 0 ? 0 : ((Number(parsedItem.tokens) || 0) / bondedTokensNumber) * 100;

					return [
						parsedItem.description && parsedItem.description.moniker,
						parsedItem,
						parseFloat((Number(parsedItem.tokens) / 10 ** config.COIN_DECIMALS).toFixed(1)),
						parseFloat(votingPercentage.toFixed(2)),
						parsedItem.commission &&
						parsedItem.commission.commission_rates &&
						parsedItem.commission.commission_rates.rate
							? parseFloat((Number(parsedItem.commission.commission_rates.rate) * 100).toFixed(2))
							: null,
						parsedItem,
						parsedItem,
					];
			  })
			: [];
	}, [active, bondedTokens, delegations, delegatedValidatorList, validatorList]);

	const options = useMemo(
		() => ({
			serverSide: false,
			print: false,
			fixedHeader: false,
			pagination: true,
			rowsPerPage: 25,
			rowsPerPageOptions: [10, 25, 50, 100, 500],
			selectableRows: 'none',
			selectToolbarPlacement: 'none',
			sortOrder: {
				name: 'voting_power',
				direction: 'desc',
			},
			textLabels: {
				body: {
					noMatch: inProgress ? <CircularProgress /> : <div className="no_data_table"> No data found </div>,
					toolTip: 'Sort',
				},
				viewColumns: {
					title: 'Show Columns',
					titleAria: 'Show/Hide Table Columns',
				},
			},
		}),
		[inProgress]
	);

	return (
		<div className="table">
			<DataTable columns={columns} data={tableData} name="stake" options={options} />
		</div>
	);
});

export default Table;
