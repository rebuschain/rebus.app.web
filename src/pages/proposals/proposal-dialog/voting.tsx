import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import styled from '@emotion/styled';
import CircularProgress from 'src/components/insync/circular-progress';
import { aminoSignTx } from 'src/utils/helper';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/default-gas-values';
import variables from 'src/utils/variables';
import {
	failedDialogActions,
	processingDialogActions,
	successDialogActions,
	snackbarActions,
	dialogActions,
	voteDetailsActions,
	tallyDetailsActions,
} from 'src/reducers/slices';
import { useStore } from 'src/stores';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';

type VotingProps = {
	proposalId: number;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const Voting = observer<VotingProps>(({ proposalId }) => {
	const [
		fetchProposalTally,
		fetchVoteDetails,
		failedDialog,
		successDialog,
		pendingDialog,
		handleClose,
		showMessage,
	] = useActions([
		tallyDetailsActions.getTallyDetails,
		voteDetailsActions.getVoteDetails,
		failedDialogActions.showFailedDialog,
		successDialogActions.showSuccessDialog,
		processingDialogActions.showProcessingDialog,
		dialogActions.hideProposalDialog,
		snackbarActions.showSnackbar,
	]);

	const { lang } = useAppSelector(selector);

	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const queries = queriesStore.get(chainStore.current.chainId);
	const account = accountStore.getAccount(chainStore.current.chainId);
	const { isEvmos } = account.rebus;
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const [value, setValue] = React.useState('');
	const [inProgress, setInProgress] = React.useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	};

	const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
		if (event.key === 'Enter' && !disable) {
			handleVote();
		}
	};

	const handleVote = async () => {
		if (!address) {
			showMessage(variables[lang]['connect_account']);
			return;
		}

		setInProgress(true);

		const option = value === 'Yes' ? 1 : value === 'Abstain' ? 2 : value === 'No' ? 3 : value === 'NoWithVeto' ? 4 : 0;

		const tx = {
			msgs: [
				{
					typeUrl: '/cosmos.gov.v1beta1.MsgVote',
					value: {
						option: option,
						proposalId: proposalId,
						voter: address,
					},
				},
			],
			fee: {
				amount: [
					{
						amount: String(gas.vote * config.GAS_PRICE_STEP_AVERAGE),
						denom: config.COIN_MINIMAL_DENOM,
					},
				],
				gas: String(gas.vote),
			},
			memo: '',
		};
		const ethTx = {
			fee: {
				amount: String(gas.vote * config.GAS_PRICE_STEP_AVERAGE),
				denom: config.COIN_MINIMAL_DENOM,
				gas: String(gas.vote),
			},
			msg: {
				proposalId: Number(proposalId),
				option,
			},
			memo: '',
		};

		let txCode = 0;
		let txHash = '';
		let txLog = '';

		try {
			if (walletStore.isLoaded) {
				const result = await walletStore.vote(ethTx, tx as any);
				txCode = result?.tx_response?.code || 0;
				txHash = result?.tx_response?.txhash || '';
				txLog = result?.tx_response?.raw_log || '';
			} else {
				const result = await aminoSignTx(tx, address, null, isEvmos);
				txCode = result?.code || 0;
				txHash = result?.transactionHash || '';
				txLog = result?.rawLog || '';
			}

			if (txCode) {
				throw new Error(txLog);
			}
		} catch (err) {
			const message = (err as any)?.message || '';

			if (message.indexOf('not yet found on the chain') > -1) {
				pendingDialog();
				return;
			}
			failedDialog({ message });
			showMessage(message);
		}

		if (txHash && !txCode) {
			successDialog({ hash: txHash });
			fetchVoteDetails({ id: proposalId, address });
			fetchProposalTally(proposalId);
			queries.queryBalances.getQueryBech32Address(address).fetch();

			// Refetch the balance after 3 seconds in case claiming airdrop might take a couple seconds
			setTimeout(() => {
				queries.queryBalances.getQueryBech32Address(address).fetch();
			}, 3000);
		}

		setInProgress(false);
	};

	const disable = value === '';

	return (
		<div className="w-6/12 text-left w-full lg:ml-5 lg:w-auto">
			<Header className="pds3r_heading">Please choose your vote</Header>
			<VotingCard
				noValidate
				autoComplete="off"
				onKeyPress={handleKeyPress}
				onSubmit={e => {
					e.preventDefault();
				}}>
				<RadioGroup name="voting" value={value} onChange={handleChange}>
					<FormControlLabel control={<Radio />} label="Yes" value="Yes" />
					<FormControlLabel control={<Radio />} label="No" value="No" />
					<FormControlLabel control={<Radio />} label="NoWithVeto" value="NoWithVeto" />
					<FormControlLabel control={<Radio />} label="Abstain" value="Abstain" />
				</RadioGroup>
				<Buttons>
					<CancelButton variant="outlined" onClick={() => handleClose()}>
						Cancel
					</CancelButton>
					<ConfirmButton disabled={disable} variant="contained" onClick={handleVote}>
						{inProgress ? <Loader /> : 'Confirm'}
					</ConfirmButton>
				</Buttons>
			</VotingCard>
		</div>
	);
});

const Loader = styled(CircularProgress)`
	height: 31px;
`;

const Header = styled.p`
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: bold;
	font-size: 14px;
	color: #ffffff;
	margin-left: 10px;
`;

const VotingCard = styled.form`
	background: rgb(45, 39, 85);
	border-radius: 0.5em;
	width: 100%;
	margin-top: 8px;
	padding: 20px 30px;

	label {
		margin-bottom: 10px;

		& > span:first-child {
			margin-right: 20px;
		}

		& > span:last-child {
			font-family: Inter, ui-sans-serif, system-ui;
			font-weight: 600;
			font-size: 14px;
			text-align: center;
			color: #ffffff;
		}

		svg {
			fill: #ffffff;
		}
	}

	@media (max-width: 769px) {
		padding: 30px;
	}
`;

const Buttons = styled.div`
	text-align: center;

	@media (max-width: 426px) {
		margin-top: 30px;

		& > button {
			width: 100%;
		}
	}
`;

const CancelButton = styled(Button)`
	border: 2px solid #ffffff;
	box-sizing: border-box;
	border-radius: 0.5em;
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	text-align: center;
	color: #ffffff;
	margin-right: 20px;
	padding: 10px 20px;
	line-height: 1;

	@media (max-width: 426px) {
		margin: unset;
	}
`;

const ConfirmButton = styled(Button)`
	background: linear-gradient(135deg, #e95062, #e950d0 50%, #5084e9);
	border-radius: 0.5em;
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	text-align: center;
	color: #ffffff;
	padding: 10px 20px;
	line-height: 1;

	@media (max-width: 426px) {
		margin-top: 10px;
	}
`;

export default Voting;
