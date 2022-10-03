import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import CircularProgress from 'src/components/insync/CircularProgress';
import { aminoSignTx } from 'src/utils/helper';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/defaultGasValues';
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
import { useActions } from 'src/hooks/useActions';
import { useAppSelector } from 'src/hooks/useAppSelect';
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
			successDialog(result.tx_response?.txhash || result.transactionHash);
			fetchVoteDetails({ id: proposalId, address });
			fetchProposalTally(proposalId);
			queries.queryBalances.getQueryBech32Address(address).fetch();

			// Refetch the balance after 3 seconds in case claiming airdrop might take a couple seconds
			setTimeout(() => {
				queries.queryBalances.getQueryBech32Address(address).fetch();
			}, 3000);
		}
	};

	const disable = value === '';

	return (
		<div className="proposal_dialog_section3_right">
			<p className="pds3r_heading">Please choose your vote</p>
			<form
				noValidate
				autoComplete="off"
				className="voting_card"
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
				<div className="buttons_div">
					<Button className="cancel_button" variant="outlined" onClick={handleClose}>
						Cancel
					</Button>
					<Button className="confirm_button" disabled={disable} variant="contained" onClick={handleVote}>
						{inProgress ? <CircularProgress /> : 'Confirm'}
					</Button>
				</div>
			</form>
		</div>
	);
});

export default Voting;
