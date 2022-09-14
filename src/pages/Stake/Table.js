import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import DataTable from 'src/components/insync/DataTable';
import './index.scss';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from 'src/components/insync/CircularProgress';
import { useStore } from '../../stores';
import UnDelegateButton from '../Home/TokenDetails/UnDelegateButton';
import ReDelegateButton from '../Home/TokenDetails/ReDelegateButton';
import DelegateButton from './DelegateButton';
import { formatCount } from 'src/utils/numberFormats';
import ValidatorName from './ValidatorName';
import { config } from 'src/config-insync';
import classNames from 'classnames';

const ValidatorCell = (value, index) => (
	<ValidatorName
		index={index && index.rowIndex}
		name={value}
		value={index.rowData && index.rowData.length && index.rowData[1]}
	/>
);

const StatusCell = value => (
	<div
		className={classNames('status', value.jailed ? 'red_status' : '', value.status !== 3 ? 'unbonded' : '')}
		title={value.status === 1 ? 'Unbonded' : value.status === 2 ? 'Unbonding' : value.status === 3 ? 'Active' : ''}>
		{value.status === 1 ? 'Unbonded' : value.status === 2 ? 'Unbonding' : value.status === 3 ? 'Active' : ''}
	</div>
);

const VotingPowerCell = value => (
	<div className="voting_power">
		<p>{formatCount(value, true)}</p>
	</div>
);

const VotingPercentageCell = value => (
	<div className="voting_percentage">
		<p>{value}%</p>
	</div>
);

const CommissionCell = value => (value ? value + '%' : '0%');

const TokensStakedCell = item => {
	let value = item.delegations.find(
		val => (val.delegation && val.delegation.validator_address) === item.operator_address
	);
	value = value ? value.balance && value.balance.amount && value.balance.amount / 10 ** config.COIN_DECIMALS : null;

	return <div className={value ? 'tokens' : 'no_tokens'}>{value || 'no tokens'}</div>;
};

const ActionCell = ({ delegations, operator_address: validatorAddress }) =>
	delegations.find(item => (item.delegation && item.delegation.validator_address) === validatorAddress) ? (
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

const columns = [
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

const Table = ({ active, delegations, delegatedValidatorList, inProgress, validatorList }) => {
	const { chainStore, queriesStore } = useStore();
	const bondedTokens = queriesStore.get(chainStore.current.chainId).cosmos.queryPool.response?.data.result
		.bonded_tokens;

	const tableData = useMemo(() => {
		let dataToMap = active === 2 ? delegatedValidatorList : validatorList;

		if (active === 3 && dataToMap) {
			// Inactive validators
			dataToMap = dataToMap.filter(item => item.status !== 3);
		} else if (active === 1 && dataToMap) {
			// Active validators
			dataToMap = dataToMap.filter(item => item.status === 3);
		}

		return dataToMap && dataToMap.length
			? dataToMap.map(item => {
					item.delegations = delegations;

					const votingPercentage = ((Number(item.tokens) || 0) / bondedTokens) * 100;

					return [
						item.description && item.description.moniker,
						item,
						parseFloat((Number(item.tokens) / 10 ** config.COIN_DECIMALS).toFixed(1)),
						parseFloat(votingPercentage.toFixed(2)),
						item.commission && item.commission.commission_rates && item.commission.commission_rates.rate
							? parseFloat((Number(item.commission.commission_rates.rate) * 100).toFixed(2))
							: null,
						item,
						item,
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
};

Table.propTypes = {
	active: PropTypes.number.isRequired,
	inProgress: PropTypes.bool.isRequired,
	lang: PropTypes.string.isRequired,
	address: PropTypes.string,
	delegatedValidatorList: PropTypes.arrayOf(
		PropTypes.shape({
			operator_address: PropTypes.string,
			status: PropTypes.number,
			tokens: PropTypes.string,
			commission: PropTypes.shape({
				commission_rates: PropTypes.shape({
					rate: PropTypes.string,
				}),
			}),
			delegator_shares: PropTypes.string,
			description: PropTypes.shape({
				moniker: PropTypes.string,
			}),
		})
	),
	delegations: PropTypes.arrayOf(
		PropTypes.shape({
			validator_address: PropTypes.string,
			balance: PropTypes.shape({
				amount: PropTypes.any,
				denom: PropTypes.string,
			}),
		})
	),
	home: PropTypes.bool,
	validatorList: PropTypes.arrayOf(
		PropTypes.shape({
			operator_address: PropTypes.string,
			status: PropTypes.number,
			tokens: PropTypes.string,
			commission: PropTypes.shape({
				commission_rates: PropTypes.shape({
					rate: PropTypes.string,
				}),
			}),
			delegator_shares: PropTypes.string,
			description: PropTypes.shape({
				moniker: PropTypes.string,
			}),
		})
	),
};

const stateToProps = state => {
	return {
		address: state.accounts.address.value,
		lang: state.language,
		validatorList: state.stake.validators.list,
		inProgress: state.stake.validators.inProgress,
		delegations: state.accounts.delegations.result,
		delegatedValidatorList: state.stake.delegatedValidators.list,
	};
};

const ObservedTable = observer(Table);

export default connect(stateToProps)(ObservedTable);
