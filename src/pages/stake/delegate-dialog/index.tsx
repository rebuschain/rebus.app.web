import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import styled from '@emotion/styled';
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
import { gas } from 'src/constants/default-gas-values';
import CircularProgress from 'src/components/insync/circular-progress';
import { useStore } from 'src/stores';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import ValidatorSelectField from './validator-select-field';
import TokensTextField from './tokens-text-field';
import ToValidatorSelectField from './to-validator-select-field';
import { TransactionResponse } from 'src/stores/wallet/types';

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
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const queries = queriesStore.get(chainStore.current.chainId);

	const delegations = queries.rebus.queryDelegations.get(address).response?.data?.result;

	const balance = queries.queryBalances.getQueryBech32Address(address).stakable.balance;

	const accountQuery = queries.rebus.queryAccount.get(address);
	const delegatedVestingBalance = accountQuery.delegatedBalance;
	const vestingBalance = accountQuery.vestingBalance;

	const [inProgress, setInProgress] = useState(false);
	const handleDelegateType = async () => {
		setInProgress(true);

		let txCode = 0;
		let txHash: string | undefined = '';
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
				const tx: TransactionResponse = await (walletStore as any)[method](ethTx, updatedTx);
				txCode = tx?.tx_response?.code || 0;
				txHash = tx?.tx_response?.txhash;
				txLog = tx?.tx_response?.raw_log || '';
			} else {
				const tx = await aminoSignTx(updatedTx, address, null, isEvmos);
				txCode = tx?.code;
				txHash = tx?.transactionHash;
				txLog = tx?.rawLog || '';
			}

			if (txLog?.includes('too many unbonding delegation entries')) {
				throw new Error(variables[lang]['error_too_many_delegations']);
			}

			if (txLog?.includes('redelegation to this validator already in progress')) {
				throw new Error(variables[lang]['error_redelegation_in_progress']);
			}

			if (txCode !== 0) {
				throw new Error(txLog);
			}

			updateBalance();
			setInProgress(false);
			successDialog({
				hash: txHash,
				tokens: new CoinPretty(chainStore.current.stakeCurrency, amountDec.mul(new Dec(COIN_DECI_VALUE)))
					.trim(true)
					.hideDenom(true)
					.toString(),
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

		handleClose();
	};

	const updateBalance = () => {
		getValidators();
		getDelegatedValidatorsDetails(address);

		accountQuery.fetch();
		queries.rebus.queryDelegations.get(address).fetch();
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
		} else if (name === 'Undelegate') {
			disable = amountDec.gt(stakedTokens.toDec());
		} else if (name === 'Redelegate') {
			disable = !toValidator || amountDec.gt(stakedTokens.toDec());
		}
	}

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog"
			open={open}
			onClose={() => handleClose()}>
			{inProgress && <CircularProgress className="full_screen" />}
			<DialogContentStyled className="content">
				<Header>{name + ' ' + variables[lang].tokens}</Header>
				{name === 'Redelegate' ? (
					<>
						<Content>From validator</Content>
						<ValidatorSelectField canDelegateToInactive={canDelegateToInactive} />
						<Content>To validator</Content>
						<ToValidatorSelectField canDelegateToInactive={canDelegateToInactive} />
					</>
				) : (
					<>
						<Content>Choose the validator</Content>
						<ValidatorSelectField canDelegateToInactive={canDelegateToInactive} />
					</>
				)}
				<Content>Enter tokens to {name || 'Delegate'}</Content>
				<TokensTextField />
			</DialogContentStyled>
			<DialogActions className="footer">
				<ButtonStyled disabled={disable} variant="contained" onClick={handleDelegateType}>
					{inProgress ? variables[lang]['approval_pending'] : name}
				</ButtonStyled>
			</DialogActions>
		</Dialog>
	);
});

const DialogContentStyled = styled(DialogContent)`
	text-align: left;

	.text_field {
		margin: unset;
	}

	.select_field {
		margin: unset !important;
		margin-bottom: 30px !important;
		width: 100%;
	}

	.select_field > div > div {
		border: 1px solid #696969;
		box-sizing: border-box;
		border-radius: 5px;
		font-family: 'Blinker', sans-serif;
		font-weight: 600;
		font-size: 18px;
		line-height: 22px;
		color: #696969;
		display: flex;
		align-items: center;
	}

	.select_field svg {
		fill: #696969;
		right: 20px;
	}

	.select_field .image {
		background: #696969;
		width: 30px;
		height: 30px;
		border-radius: 50px;
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.text_field > div {
		height: 50px;
	}
`;

const Header = styled.h1`
	font-family: 'Blinker', sans-serif;
	font-weight: bold;
	font-size: 24px;
	line-height: 29px;
	text-align: center;
	color: #ffffff;
	margin: unset;
	margin-bottom: 65px;
`;

const Content = styled.p`
	font-family: 'Blinker', sans-serif;
	font-size: 18px;
	line-height: 22px;
	color: #696969;
	margin-bottom: 6px;
`;

const ButtonStyled = styled(Button)`
	&:disabled {
		opacity: 0.5;
	}
`;

export default DelegateDialog;
