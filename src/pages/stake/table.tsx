import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { MUIDataTableColumnDef, MUIDataTableMeta } from 'mui-datatables';
import classNames from 'classnames';
import DataTable from 'src/components/insync/data-table';
import CircularProgress from 'src/components/insync/circular-progress';
import { useStore } from 'src/stores';
import { formatCount } from 'src/utils/number-formats';
import { config } from 'src/config-insync';
import { useAppSelector } from 'src/hooks/use-app-select';
import { useAddress } from 'src/hooks/use-address';
import UnDelegateButton from '../home/token-details/un-delegate-button';
import ReDelegateButton from '../home/token-details/re-delegate-button';
import DelegateButton from './delegate-button';
import ValidatorName from './validator-name';

const ValidatorCell = (value: any, tableMeta: MUIDataTableMeta) => (
	<ValidatorName
		index={tableMeta && tableMeta.rowIndex}
		name={value}
		value={tableMeta.rowData && tableMeta.rowData.length && tableMeta.rowData[1]}
	/>
);

const StatusCell = (value: any) => (
	<StatusCellWrapper
		className={classNames('status', value.jailed ? 'red_status' : '', value.status !== 3 ? 'unbonded' : '')}
		title={value.status === 1 ? 'Unbonded' : value.status === 2 ? 'Unbonding' : value.status === 3 ? 'Active' : ''}>
		{value.status === 1 ? 'Unbonded' : value.status === 2 ? 'Unbonding' : value.status === 3 ? 'Active' : ''}
	</StatusCellWrapper>
);

const VotingPowerCell = (value: any) => (
	<VotingCellWrapper>
		<p>{formatCount(value, true)}</p>
	</VotingCellWrapper>
);

const VotingPercentageCell = (value: any) => (
	<VotingCellWrapper>
		<p>{value}%</p>
	</VotingCellWrapper>
);

const CommissionCell = (value: any) => (value ? value + '%' : '0%');

const TokensStakedCell = (item: any) => {
	let value = item.delegations.find(
		(val: any) => (val.delegation && val.delegation.validator_address) === item.operator_address
	);
	value = value ? value.balance && value.balance.amount && value.balance.amount / 10 ** config.COIN_DECIMALS : null;

	return <TokensCellWrapper className={value ? 'tokens' : 'no_tokens'}>{value || 'no tokens'}</TokensCellWrapper>;
};

const ActionCell = ({ delegations, operator_address: validatorAddress }: any) =>
	delegations.find((item: any) => (item.delegation && item.delegation.validator_address) === validatorAddress) ? (
		<ActionCellWrapper>
			<ReDelegateButton valAddress={validatorAddress} />
			<Divider />
			<UnDelegateButton valAddress={validatorAddress} />
			<Divider />
			<DelegateButton valAddress={validatorAddress} />
		</ActionCellWrapper>
	) : (
		<ActionCellWrapper>
			<DelegateButton valAddress={validatorAddress} />
		</ActionCellWrapper>
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
		<TableContainer>
			<DataTable columns={columns} data={tableData} name="stake" options={options} />
		</TableContainer>
	);
});

const TableContainer = styled.div`
	display: inherit;

	.circular_progress > div {
		color: #3f51b5;
	}

	[class^='MUIDataTable-liveAnnounce'] {
		display: none;
	}

	td p {
		color: #ffffff;
		font-size: 14px;
		text-align: left;
	}

	tfoot td {
		border-bottom: unset;
	}

	.MuiTableRow-footer {
		border-bottom: none;

		.MuiTableCell-footer {
			background-color: #2d2755;
			border-bottom-left-radius: 1rem;
			border-bottom-right-radius: 1rem;

			p,
			.MuiSelect-select,
			svg {
				color: rgba(255, 255, 255, 0.6);
			}
		}
	}

	@media (max-width: 769px) {
		background: unset;
		padding: 0;
		backdrop-filter: unset;
		border-radius: unset;
	}
`;

const Divider = styled.span`
	border: 1px solid #d2d2d2;
	margin: 0 10px;
	height: 20px;

	@media (max-width: 426px) {
		display: none;
	}
`;

const TokensCellWrapper = styled.div`
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 18px;
	line-height: 130%;

	&.no_tokens {
		color: rgba(255, 255, 255, 0.6);
	}

	&.tokens {
		text-align: center;
		color: #5084e9;
	}

	@media (max-width: 958px) {
		text-align: right !important;
	}
`;

const StatusCellWrapper = styled.div`
	background: linear-gradient(104.04deg, #50e996 0%, #b8e950 100%);
	box-sizing: border-box;
	border-radius: 4px;
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 14px;
	color: green;
	padding: 6px 10px;

	&.red_status {
		background: linear-gradient(104.04deg, #e95062 0%, #e950d0 100%);
		color: white;
	}

	&.unbonded {
		background: linear-gradient(104.04deg, #dddbe9 0%, #c2c0d1 100%);
		color: black;
	}

	@media (max-width: 1025px) {
		width: max-content;
		margin: auto;
	}

	@media (max-width: 958px) {
		margin-right: unset;
	}
`;

const VotingCellWrapper = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;

	@media (max-width: 958px) {
		justify-content: flex-end;
	}
`;

const ActionCellWrapper = styled.div`
	align-items: center;
	display: flex;
	justify-content: flex-end;

	@media (max-width: 426px) {
		justify-content: space-around;
		flex-wrap: wrap;

		& > button {
			padding: 5px 10px;
		}
	}

	@media (max-width: 375px) {
		flex-direction: column;

		& > button {
			width: 100%;
			margin: 4px 0;
		}
	}
`;

export default Table;
