import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import variables from 'src/utils/variables';
import { aminoSignTx } from 'src/utils/helper';
import {
	snackbarActions,
	delegateDialogActions,
	delegatedValidatorsActions,
	successDialogActions,
	failedDialogActions,
	processingDialogActions,
	validatorsActions,
} from 'src/reducers/slices';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/defaultGasValues';
import CircularProgress from 'src/components/insync/CircularProgress';
import { useStore } from 'src/stores';
import { useActions } from 'src/hooks/useActions';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { RootState } from 'src/reducers/store';
import ValidatorSelectField from './ValidatorSelectField';
import TokensTextField from './TokensTextField';
import ToValidatorSelectField from './ToValidatorSelectField';
import './index.scss';

const COIN_DECI_VALUE = 10 ** config.COIN_DECIMALS;

type DelegateDialogProps = {
	canDelegateToInactive?: boolean;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.stake.delegateDialog.open,
		name: state.stake.delegateDialog.name,
		amount: state.stake.delegateDialog.tokens,
		validator: state.stake.delegateDialog.validatorAddress,
		toValidator: state.stake.delegateDialog.toValidatorAddress,
	};
};

const DelegateDialog = observer<DelegateDialogProps>(({ canDelegateToInactive }) => {
	const [
		handleClose,
		successDialog,
		failedDialog,
		pendingDialog,
		getValidators,
		getDelegatedValidatorsDetails,
		showMessage,
	] = useActions([
		delegateDialogActions.hideDelegateDialog,
		successDialogActions.showSuccessDialog,
		failedDialogActions.showFailedDialog,
		processingDialogActions.showProcessingDialog,
		validatorsActions.getValidators,
		delegatedValidatorsActions.getDelegatedValidatorsDetails,
		snackbarActions.showSnackbar,
	]);

	const { lang, open, name, amount, validator, toValidator } = useAppSelector(selector);
	const amountDec = new Dec(amount || '0');

	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const { isEvmos } = account.rebus;
	const address = walletStore.isLoaded ? walletStore.address : account.bech32Address;
	const queries = queriesStore.get(chainStore.current.chainId);

	const delegations = queries.rebus.queryDelegations.get(address).response?.data?.result;

	const balance = queries.queryBalances.getQueryBech32Address(address).stakable.balance;

	const accountQuery = queries.rebus.queryAccount.get(address);
	const delegatedVestingBalance = accountQuery.delegatedBalance;
	const vestingBalance = accountQuery.vestingBalance;

	const [inProgress, setInProgress] = useState(false);
	const handleDelegateType = async () => {
		setInProgress(true);

		let txHash = '';
		let gasValue = gas.delegate;
		let method = 'delegate';

		if (name === 'Redelegate') {
			gasValue = gas.re_delegate;
			method = 'reDelegate';
		} else if (name === 'Undelegate') {
			gasValue = gas.un_delegate;
			method = 'unDelegate';
		}

		const value = getValueObject(name);
		const gasAmount = {
			amount: String(BigInt(gasValue * config.GAS_PRICE_STEP_AVERAGE)),
			denom: config.COIN_MINIMAL_DENOM,
		};
		const gasString = String(gasValue);

		const updatedTx = {
			msg: {
				typeUrl:
					name === 'Delegate' || name === 'Stake'
						? '/cosmos.staking.v1beta1.MsgDelegate'
						: name === 'Undelegate'
						? '/cosmos.staking.v1beta1.MsgUndelegate'
						: name === 'Redelegate'
						? '/cosmos.staking.v1beta1.MsgBeginRedelegate'
						: '',
				value,
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
				...value,
				amount: value.amount?.amount,
				denom: value.amount?.denom,
			},
			memo: '',
		};
		let txLog = '';

		try {
			if (walletStore.isLoaded) {
				const tx = await (walletStore as any)[method](ethTx, updatedTx);
				txHash = tx?.tx_response?.txhash;
				txLog = tx?.tx_response?.raw_log || '';
			} else {
				const tx = await aminoSignTx(updatedTx, address, null, isEvmos);
				txHash = tx?.transactionHash;
				txLog = tx?.rawLog || '';
			}

			if (txLog?.includes('too many unbonding delegation entries')) {
				throw new Error(variables[lang]['error_too_many_delegations']);
			}

			if (txLog?.includes('redelegation to this validator already in progress')) {
				throw new Error(variables[lang]['error_redelegation_in_progress']);
			}

			updateBalance();
			setInProgress(false);
			successDialog({
				hash: txHash,
				tokens: new CoinPretty(chainStore.current.stakeCurrency, amountDec).hideDenom(true).toString(),
			});
		} catch (error) {
			setInProgress(false);

			const message = (error as any)?.message || '';

			if (message.indexOf('not yet found on the chain') > -1) {
				pendingDialog();
			} else {
				failedDialog({ message, hash: txHash });
				showMessage(message);
			}
		}
	};

	const updateBalance = () => {
		getValidators();
		getDelegatedValidatorsDetails(address);

		accountQuery.fetch();
		queries.rebus.querySuperfluidDelegations.getQuerySuperfluidDelegations(address).fetch();
		queries.queryBalances.getQueryBech32Address(address).fetch();
		queries.cosmos.queryRewards.getQueryBech32Address(address).fetch();
		queries.cosmos.queryDelegations.getQueryBech32Address(address).fetch();
		queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(address).fetch();
	};

	const getValueObject = (type: 'Stake' | 'Delegate' | 'Undelegate' | 'Redelegate' | '') => {
		switch (type) {
			case 'Stake':
			case 'Delegate':
			case 'Undelegate':
				return {
					delegatorAddress: address,
					validatorAddress: validator,
					amount: {
						amount: String(BigInt(parseFloat(amount || '0') * COIN_DECI_VALUE)),
						denom: config.COIN_MINIMAL_DENOM,
					},
				};
			case 'Redelegate':
				return {
					delegatorAddress: address,
					validatorSrcAddress: validator,
					validatorDstAddress: toValidator,
					amount: {
						amount: String(BigInt(parseFloat(amount || '0') * COIN_DECI_VALUE)),
						denom: config.COIN_MINIMAL_DENOM,
					},
				};
			default:
				return {};
		}
	};

	const vestingTokens = vestingBalance.sub(delegatedVestingBalance);

	let stakedTokens = new CoinPretty(chainStore.current.stakeCurrency, 0);
	delegations?.forEach(currentValue => {
		stakedTokens = stakedTokens.add(new Dec(currentValue.balance.amount));
	});

	if (validator && (name === 'Undelegate' || name === 'Redelegate')) {
		const filterList = delegations?.find(value => value.delegation && value.delegation.validator_address === validator);

		if (filterList && filterList.balance && filterList.balance.amount) {
			stakedTokens = new CoinPretty(chainStore.current.stakeCurrency, new Dec(filterList.balance.amount));
		}
	}

	let disable = !validator || !amount || inProgress;

	if (!disable) {
		if ((name === 'Delegate' || name === 'Stake') && vestingTokens.toDec().gt(new Dec(0))) {
			disable = amountDec.gt(balance.add(vestingTokens).toDec());
		} else if (name === 'Delegate' || name === 'Stake') {
			disable = amountDec.gt(balance.toDec());
		} else if (name === 'Undelegate' || name === 'Redelegate') {
			disable = amountDec.gt(stakedTokens.toDec());
		}
	}

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog delegate_dialog"
			open={open}
			onClose={handleClose}>
			{inProgress && <CircularProgress className="full_screen" />}
			<DialogContent className="content">
				<h1>{name + ' ' + variables[lang].tokens}</h1>
				{name === 'Redelegate' ? (
					<>
						<p>From validator</p>
						<ValidatorSelectField canDelegateToInactive={canDelegateToInactive} />
						<p>To validator</p>
						<ToValidatorSelectField canDelegateToInactive={canDelegateToInactive} />
					</>
				) : (
					<>
						<p>Choose the validator</p>
						<ValidatorSelectField canDelegateToInactive={canDelegateToInactive} />
					</>
				)}
				<p>Enter tokens to {name || 'Delegate'}</p>
				<TokensTextField />
			</DialogContent>
			<DialogActions className="footer">
				<Button disabled={disable} variant="contained" onClick={handleDelegateType}>
					{inProgress ? variables[lang]['approval_pending'] : name}
				</Button>
			</DialogActions>
		</Dialog>
	);
});

export default DelegateDialog;
