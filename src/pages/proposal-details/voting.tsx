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
		showProposalDialog,
	] = useActions([
		tallyDetailsActions.getTallyDetails,
		voteDetailsActions.getVoteDetails,
		failedDialogActions.showFailedDialog,
		successDialogActions.showSuccessDialog,
		processingDialogActions.showProcessingDialog,
		dialogActions.hideProposalDialog,
		snackbarActions.showSnackbar,
		dialogActions.showProposalDialog,
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

		let result: any = null;

		try {
			if (walletStore.isLoaded) {
				result = await walletStore.vote(ethTx, tx as any);
			} else {
				result = await aminoSignTx(tx, address, null, isEvmos);
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

		if (result) {
			showProposalDialog({ open: true });
			successDialog({ hash: result.tx_response?.txhash || result.transactionHash });

			fetchVoteDetails({ id: proposalId, address });
			fetchProposalTally(proposalId);
			queries.queryBalances.getQueryBech32Address(address).fetch();
			queries.cosmos.queryProposalVote.getVote(`${proposalId}`, address).fetch();

			// Refetch the balance after 3 seconds in case claiming airdrop might take a couple seconds
			setTimeout(() => {
				queries.queryBalances.getQueryBech32Address(address).fetch();
			}, 3000);
		}

		setInProgress(false);
	};

	const disable = value === '';

	return (
		<div className="w-6/12 text-left w-full lg:w-auto">
			<VotingCard
				noValidate
				autoComplete="off"
				onKeyPress={handleKeyPress}
				onSubmit={e => {
					e.preventDefault();
				}}>
				<RadioGroup row name="voting" value={value} onChange={handleChange}>
					<FormControlLabel
						style={{ marginRight: '25px' }}
						control={<Radio style={{ marginRight: '0px' }} />}
						label="Yes"
						value="Yes"
					/>
					<FormControlLabel
						style={{ marginRight: '25px' }}
						control={<Radio style={{ marginRight: '0px' }} />}
						label="No"
						value="No"
					/>
					<FormControlLabel
						style={{ marginRight: '25px' }}
						control={<Radio style={{ marginRight: '0px' }} />}
						label="No With Veto"
						value="NoWithVeto"
					/>
					<FormControlLabel
						style={{ marginRight: '25px' }}
						control={<Radio style={{ marginRight: '0px' }} />}
						label="Abstain"
						value="Abstain"
					/>
				</RadioGroup>
				<Button className="btn gradient-pink" disabled={disable} variant="contained" onClick={handleVote}>
					{inProgress ? <Loader /> : 'Confirm'}
				</Button>
			</VotingCard>
		</div>
	);
});

const Loader = styled(CircularProgress)`
	height: 31px;
`;

const VotingCard = styled.form`
	background: rgb(45, 39, 85);
	border-radius: 0.5em;
	width: 100%;
	margin-top: 8px;

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

export default Voting;
