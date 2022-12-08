import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import { useStore } from 'src/stores';
import { aminoSignTx } from 'src/utils/helper';
import {
	claimDialogActions,
	failedDialogActions,
	processingDialogActions,
	successDialogActions,
} from 'src/reducers/slices/stake/slices';
import { actions } from 'src/reducers/slices/snackbar';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/default-gas-values';
import variables from 'src/utils/variables';
import CircularProgress from 'src/components/insync/circular-progress';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import ValidatorsSelectField from './validators-select-field';
import styled from '@emotion/styled';

const selector = (state: RootState) => ({
	lang: state.language,
	open: state.stake.claimDialog.open,
	value: state.stake.claimDialog.validator,
});

const ClaimDialog = observer(() => {
	const [inProgress, setInProgress] = useState(false);

	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const queries = queriesStore.get(chainStore.current.chainId);
	const account = accountStore.getAccount(chainStore.current.chainId);
	const { isEvmos } = account.rebus;
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const rewardsQuery = queries.cosmos.queryRewards.getQueryBech32Address(address);
	const rewards = rewardsQuery.response?.data?.result;
	const rewardsLength = rewards?.rewards?.length || 0;

	const { lang, open, value } = useAppSelector(selector);

	const [handleClose, failedDialog, successDialog, pendingDialog, showMessage] = useActions([
		claimDialogActions.hideClaimDialog,
		failedDialogActions.showFailedDialog,
		successDialogActions.showSuccessDialog,
		processingDialogActions.showProcessingDialog,
		actions.showSnackbar,
	]);

	const handleClaimAll = async () => {
		setInProgress(true);
		let gasValue = gas.claim_reward;
		if (rewardsLength > 1) {
			gasValue = ((rewardsLength - 1) / 2) * gas.claim_reward + gas.claim_reward;
		}

		const gasAmount = {
			amount: String(BigInt(gasValue * config.GAS_PRICE_STEP_AVERAGE)),
			denom: config.COIN_MINIMAL_DENOM,
		};
		const gasString = String(gasValue);
		const updatedTx: any = {
			msgs: [],
			fee: {
				amount: [gasAmount],
				gas: gasString,
			},
			memo: '',
		};

		if (rewardsLength) {
			rewards?.rewards?.map((item: any) => {
				updatedTx.msgs.push({
					typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
					value: {
						delegatorAddress: address,
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
				validatorAddresses: updatedTx.msgs.map(({ value }: any) => value.validatorAddress),
			},
			memo: '',
		};

		try {
			if (walletStore.isLoaded) {
				const tx = await walletStore.claimRewards(ethTx, updatedTx);
				successDialog({ hash: tx?.tx_response?.txhash, tokens: tokensPretty });
			} else {
				const result = await aminoSignTx(updatedTx, address, null, isEvmos);
				successDialog({ hash: result?.transactionHash, tokens: tokensPretty });
			}
		} catch (error) {
			const message: string = (error as any)?.message || '';

			if (message) {
				if (message.indexOf('not yet found on the chain') > -1) {
					pendingDialog();
				} else {
					failedDialog({ message });
					showMessage(message);
				}
			}
		}

		rewardsQuery.fetch();
		queries.queryBalances.getQueryBech32Address(address).fetch();
		queries.cosmos.queryRewards.getQueryBech32Address(address).fetch();
		setInProgress(false);
	};

	const handleClaim = async () => {
		setInProgress(true);

		const gasAmount = {
			amount: String(BigInt(gas.claim_reward * config.GAS_PRICE_STEP_AVERAGE)),
			denom: config.COIN_MINIMAL_DENOM,
		};
		const gasString = String(gas.claim_reward);
		const updatedTx: any = {
			msg: {
				typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
				value: {
					delegatorAddress: address,
					validatorAddress: value,
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
				validatorAddresses: [value],
			},
			memo: '',
		};

		try {
			if (walletStore.isLoaded) {
				const tx = await walletStore.claimRewards(ethTx, updatedTx);
				successDialog({ hash: tx?.tx_response?.txhash, tokens: tokensPretty });
			} else {
				const result = await aminoSignTx(updatedTx, address, null, isEvmos);
				successDialog({ hash: result?.transactionHash, tokens: tokensPretty });
			}
		} catch (error) {
			const message: string = (error as any)?.message || '';

			if (message) {
				if (message.indexOf('not yet found on the chain') > -1) {
					pendingDialog();
				} else {
					failedDialog({ message });
					showMessage(message);
				}
			}
		}

		rewardsQuery.fetch();
		queries.queryBalances.getQueryBech32Address(address).fetch();
		queries.cosmos.queryRewards.getQueryBech32Address(address).fetch();
		setInProgress(false);
	};

	const tokens = useMemo(() => {
		if (value === 'all' && rewards?.rewards?.length) {
			let total = new CoinPretty(chainStore.current.stakeCurrency, new Dec(0));

			rewards?.rewards?.forEach((value: any) => {
				total = total.add(new Dec(value.reward?.[0]?.amount || '0'));
			});

			return total;
		}

		const parsedRewards =
			(rewards && rewards.rewards?.length && rewards.rewards.filter(item => item.validator_address === value)) || [];

		return new CoinPretty(chainStore.current.stakeCurrency, parsedRewards?.[0]?.reward?.[0]?.amount || '0');
	}, [chainStore, rewards, value]);

	const tokensPretty = tokens
		.trim(true)
		.maxDecimals(8)
		.hideDenom(true)
		.shrink(true)
		.toString();

	const disable = value === 'none' || inProgress;

	return (
		<DialogStyled
			aria-describedby="claim-dialog-description"
			aria-labelledby="claim-dialog-title"
			className="dialog delegate_dialog claim_dialog"
			open={open}
			onClose={() => handleClose()}>
			{inProgress && <CircularProgress className="full_screen" />}
			<DialogContent className="content">
				<Header>Claim Rewards</Header>
				<Text>Select validator</Text>
				<ValidatorsSelectField />
				{tokens.toDec().gt(new Dec(0)) ? <Text className="mt-7.5">Rewards: {tokensPretty}</Text> : null}
			</DialogContent>
			<DialogActions className="footer">
				<ButtonStyled disabled={disable} variant="contained" onClick={value === 'all' ? handleClaimAll : handleClaim}>
					{inProgress ? variables[lang]['approval_pending'] : variables[lang].claim}
				</ButtonStyled>
			</DialogActions>
		</DialogStyled>
	);
});

const DialogStyled = styled(Dialog)`
	.text_field {
		margin: unset;
	}

	.select_field {
		margin: unset;
		margin-bottom: 30px;
		width: 100%;

		& > div > div {
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

		svg {
			fill: #696969;
			right: 20px;
		}
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

const Text = styled.p`
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

export default ClaimDialog;
