import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import {
	hideClaimRewardsDialog,
	setTokens,
	showDelegateFailedDialog,
	showDelegateProcessingDialog,
	showDelegateSuccessDialog,
} from 'src/actions/stake';
import { connect } from 'react-redux';
import '../../Stake/DelegateDialog/index.scss';
import { useStore } from '../../../stores';
import ValidatorsSelectField from './ValidatorsSelectField';
import { aminoSignTx } from 'src/utils/helper';
import { showMessage } from 'src/actions/snackbar';
import { fetchRewards, fetchVestingBalance, getBalance } from 'src/actions/accounts';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/defaultGasValues';
import variables from 'src/utils/variables';
import CircularProgress from 'src/components/insync/CircularProgress';

const ClaimDialog = observer(props => {
	const [inProgress, setInProgress] = useState(false);

	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const queries = queriesStore.get(chainStore.current.chainId);
	const { isEvmos } = accountStore.getAccount(chainStore.current.chainId).rebus;

	const handleClaimAll = async () => {
		setInProgress(true);
		var gasValue = gas.claim_reward;
		if (props.rewards && props.rewards.rewards && props.rewards.rewards.length > 1) {
			gasValue = ((props.rewards.rewards.length - 1) / 2) * gas.claim_reward + gas.claim_reward;
		}

		const gasAmount = {
			amount: String(BigInt(gasValue * config.GAS_PRICE_STEP_AVERAGE)),
			denom: config.COIN_MINIMAL_DENOM,
		};
		const gasString = String(gasValue);
		const updatedTx = {
			msgs: [],
			fee: {
				amount: [gasAmount],
				gas: gasString,
			},
			memo: '',
		};

		if (props.rewards && props.rewards.rewards && props.rewards.rewards.length) {
			props.rewards.rewards.map(item => {
				updatedTx.msgs.push({
					typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
					value: {
						delegatorAddress: props.address,
						validatorAddress: item.validator_address,
					},
				});

				return null;
			});
		}

		const ethTx = {
			fee: {
				...gasAmount,
				gas: gasString,
			},
			msg: {
				validatorAddresses: updatedTx.msgs.map(({ value }) => value.validatorAddress),
			},
			memo: '',
		};

		try {
			if (walletStore.isLoaded) {
				const tx = await walletStore.claimRewards(ethTx, updatedTx);
				props.successDialog(tx?.tx_response?.txhash);
			} else {
				const result = await aminoSignTx(updatedTx, props.address, null, isEvmos);
				props.successDialog(result?.transactionHash);
			}
		} catch (error) {
			const message = error?.message || '';

			if (message) {
				if (message.indexOf('not yet found on the chain') > -1) {
					props.pendingDialog();
				} else {
					props.failedDialog();
					props.showMessage(message);
				}
			}
		}

		props.setTokens(tokens);
		props.fetchRewards(props.address);
		props.getBalance(props.address);
		props.fetchVestingBalance(props.address);
		queries.queryBalances.getQueryBech32Address(props.address).fetch();
		queries.cosmos.queryRewards.getQueryBech32Address(props.address).fetch();
		setInProgress(false);
	};

	const handleClaim = async () => {
		setInProgress(true);

		const gasAmount = {
			amount: String(BigInt(gas.claim_reward * config.GAS_PRICE_STEP_AVERAGE)),
			denom: config.COIN_MINIMAL_DENOM,
		};
		const gasString = String(gas.claim_reward);
		const updatedTx = {
			msg: {
				typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
				value: {
					delegatorAddress: props.address,
					validatorAddress: props.value,
					amount: {
						denom: config.COIN_MINIMAL_DENOM,
					},
				},
			},
			fee: {
				amount: [gasAmount],
				gas: gasString,
			},
			memo: '',
		};
		const ethTx = {
			fee: {
				...gasAmount,
				gas: gasString,
			},
			msg: {
				validatorAddresses: [props.value],
			},
			memo: '',
		};

		try {
			if (walletStore.isLoaded) {
				const tx = await walletStore.claimRewards(ethTx, updatedTx);
				props.successDialog(tx?.tx_response?.txhash);
			} else {
				const result = await aminoSignTx(updatedTx, props.address, null, isEvmos);
				props.successDialog(result?.transactionHash);
			}
		} catch (error) {
			const message = error?.message || '';

			if (message) {
				if (message.indexOf('not yet found on the chain') > -1) {
					props.pendingDialog();
				} else {
					props.failedDialog();
					props.showMessage(message);
				}
			}
		}

		props.setTokens(tokens);
		props.fetchRewards(props.address);
		props.getBalance(props.address);
		props.fetchVestingBalance(props.address);
		queries.queryBalances.getQueryBech32Address(props.address).fetch();
		queries.cosmos.queryRewards.getQueryBech32Address(props.address).fetch();
		setInProgress(false);
	};

	const rewards =
		props.rewards &&
		props.rewards.rewards &&
		props.rewards.rewards.length &&
		props.rewards.rewards.filter(value => value.validator_address === props.value);

	let tokens =
		rewards &&
		rewards.length &&
		rewards[0] &&
		rewards[0].reward &&
		rewards[0].reward.length &&
		rewards[0].reward[0] &&
		rewards[0].reward[0].amount
			? rewards[0].reward[0].amount / 10 ** config.COIN_DECIMALS
			: 0;

	if (props.value === 'all' && props.rewards && props.rewards.rewards && props.rewards.rewards.length) {
		let total = 0;

		props.rewards.rewards.map(value => {
			const rewards =
				value.reward && value.reward[0] && value.reward[0].amount
					? value.reward[0].amount / 10 ** config.COIN_DECIMALS
					: 0;
			total = rewards + total;

			return total;
		});

		tokens = total;
	}

	const disable = props.value === 'none' || inProgress;

	return (
		<Dialog
			aria-describedby="claim-dialog-description"
			aria-labelledby="claim-dialog-title"
			className="dialog delegate_dialog claim_dialog"
			open={props.open}
			onClose={props.handleClose}>
			{inProgress && <CircularProgress className="full_screen" />}
			<DialogContent className="content">
				<h1>Claim Rewards</h1>
				<p>Select validator</p>
				<ValidatorsSelectField />
				{tokens && tokens > 0 ? <p>rewards: {tokens.toFixed(4)}</p> : null}
			</DialogContent>
			<DialogActions className="footer">
				<Button disabled={disable} variant="contained" onClick={props.value === 'all' ? handleClaimAll : handleClaim}>
					{inProgress ? variables[props.lang]['approval_pending'] : variables[props.lang].claim}
				</Button>
			</DialogActions>
		</Dialog>
	);
});

ClaimDialog.propTypes = {
	failedDialog: PropTypes.func.isRequired,
	fetchRewards: PropTypes.func.isRequired,
	fetchVestingBalance: PropTypes.func.isRequired,
	getBalance: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
	lang: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	pendingDialog: PropTypes.func.isRequired,
	rewards: PropTypes.shape({
		rewards: PropTypes.array,
		total: PropTypes.array,
	}).isRequired,
	setTokens: PropTypes.func.isRequired,
	showMessage: PropTypes.func.isRequired,
	successDialog: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	address: PropTypes.string,
};

const stateToProps = state => {
	return {
		address: state.accounts.address.value,
		lang: state.language,
		open: state.stake.claimDialog.open,
		value: state.stake.claimDialog.validator,
		rewards: state.accounts.rewards.result,
	};
};

const actionToProps = {
	handleClose: hideClaimRewardsDialog,
	failedDialog: showDelegateFailedDialog,
	successDialog: showDelegateSuccessDialog,
	pendingDialog: showDelegateProcessingDialog,
	getBalance,
	fetchVestingBalance,
	showMessage,
	fetchRewards,
	setTokens,
};

export default connect(stateToProps, actionToProps)(ClaimDialog);
