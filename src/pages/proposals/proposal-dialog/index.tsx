import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton } from '@material-ui/core';
import moment from 'moment';
import ClassNames from 'classnames';
import Icon from 'src/components/insync/icon';
import { voteDetailsActions, dialogActions } from 'src/reducers/slices';
import { tally } from 'src/utils/number-formats';
import { RootState } from 'src/reducers/store';
import { useActions } from 'src/hooks/use-actions';
import { useAddress } from 'src/hooks/use-address';
import { useAppSelector } from 'src/hooks/use-app-select';
import Voting from './voting';
import './index.scss';

const selector = (state: RootState) => {
	return {
		open: state.proposals.dialog.open,
		proposalDetails: state.proposals.proposalDetails.value,
		proposal: state.proposals.dialog.value,
		voteDetails: state.proposals.voteDetails.value,
		voteDetailsInProgress: state.proposals.voteDetails.inProgress,
		tallyDetails: state.proposals.tallyDetails.value,
	};
};

const ProposalDialog = observer(() => {
	const { open, proposalDetails, proposal, voteDetails, voteDetailsInProgress, tallyDetails } = useAppSelector(
		selector
	);
	const [handleClose, fetchVoteDetails] = useActions([
		dialogActions.hideProposalDialog,
		voteDetailsActions.getVoteDetails,
	]);
	const address = useAddress();

	const [show, setShow] = useState(false);

	let votedOption =
		voteDetails &&
		voteDetails.length &&
		proposal &&
		proposal.id &&
		voteDetails.filter(vote => vote.proposal_id === proposal.id)[0];
	let proposer = proposal && proposal.proposer;

	proposalDetails &&
		Object.keys(proposalDetails).length &&
		Object.keys(proposalDetails).filter(key => {
			if (key === proposal.id) {
				if (
					proposalDetails[key] &&
					proposalDetails[key][0] &&
					proposalDetails[key][0].tx &&
					proposalDetails[key][0].tx.value &&
					proposalDetails[key][0].tx.value.msg[0] &&
					proposalDetails[key][0].tx.value.msg[0].value &&
					proposalDetails[key][0].tx.value.msg[0].value.proposer
				) {
					proposer = proposalDetails[key][0].tx.value.msg[0].value.proposer;
				}
			}

			return null;
		});

	if (votedOption && votedOption.options && votedOption.options.length) {
		votedOption = votedOption.options[0];
	}

	const handleChange = () => {
		setShow(!show);
	};

	const voteCalculation = (val: 'yes' | 'no' | 'no_with_veto' | 'abstain') => {
		if (proposal.status === 2) {
			const value = tallyDetails && tallyDetails[proposal.id];
			const sum =
				value &&
				value.yes &&
				value.no &&
				value.no_with_veto &&
				value.abstain &&
				parseInt(value.yes) + parseInt(value.no) + parseInt(value.no_with_veto) + parseInt(value.abstain);

			return tallyDetails && tallyDetails[proposal.id] && tallyDetails[proposal.id][val]
				? tally(tallyDetails[proposal.id][val], sum)
				: '0%';
		} else {
			const sum =
				proposal.final_tally_result &&
				proposal.final_tally_result.yes &&
				proposal.final_tally_result.no &&
				proposal.final_tally_result.no_with_veto &&
				proposal.final_tally_result.abstain &&
				parseInt(proposal.final_tally_result.yes) +
					parseInt(proposal.final_tally_result.no) +
					parseInt(proposal.final_tally_result.no_with_veto) +
					parseInt(proposal.final_tally_result.abstain);

			return proposal && proposal.final_tally_result && proposal.final_tally_result[val]
				? tally(proposal.final_tally_result[val], sum)
				: '0%';
		}
	};

	useEffect(() => {
		if (!votedOption && proposal?.id && address) {
			fetchVoteDetails({ id: proposal.id, address: address });
		}
	}, [address, fetchVoteDetails, proposal.id, votedOption]);

	if (!open) {
		return null;
	}

	return (
		<div className="proposal_dialog padding">
			<div className="content">
				<IconButton className="close_button" onClick={handleClose}>
					<Icon className="close" icon="close" />
				</IconButton>
				<div className="proposal_dialog_section1">
					<div className="proposal_dialog_section1_header">
						{proposal && proposal.content && proposal.content.value && proposal.content.value.title}
					</div>
					<div
						className={ClassNames(
							'proposal_dialog_section1_status',
							proposal.status === 2 ? 'voting_period' : proposal.status === 4 ? 'rejected' : null
						)}>
						{' '}
						Proposal Status: &nbsp;
						{proposal && proposal.status
							? proposal.status === 0
								? 'Nil'
								: proposal.status === 1
								? 'DepositPeriod'
								: proposal.status === 2
								? 'VotingPeriod'
								: proposal.status === 3
								? 'Passed'
								: proposal.status === 4
								? 'Rejected'
								: proposal.status === 5
								? 'Failed'
								: ''
							: ''}
					</div>
				</div>
			</div>
			<div className="pool content">
				<div className="proposal_dialog_section2">
					<pre className={ClassNames('proposal_dialog_section2_content', show ? 'show_more' : '')}>
						{proposal && proposal.content && proposal.content.value && proposal.content.value.description}
					</pre>
					<div className="proposal_dialog_section2_more" onClick={handleChange}>
						{show ? 'Read Less...' : 'Read More...'}
					</div>
				</div>
				<div className="proposal_dialog_section3">
					<div className="proposal_dialog_section3_left">
						<div className="pds3l_c">
							<p className="pds3l_c1">Proposer</p>
							{proposer && (
								<div className="pds3l_c2 hash_text" title={proposer}>
									<p className="name">{proposer}</p>
									{proposer && proposer.slice(proposer.length - 6, proposer.length)}
								</div>
							)}
						</div>
						<div className="pds3l_c">
							<p className="pds3l_c1">Submitted on</p>
							<p className="pds3l_c2">
								{proposal && proposal.submit_time ? moment(proposal.submit_time).format('DD-MMM-YYYY HH:mm:ss') : ''}
							</p>
						</div>
						<div className="pds3l_c">
							<p className="pds3l_c1">Voting Period</p>
							<div className="pds3l_c2 vp_cards">
								<p>
									{proposal && proposal.voting_start_time
										? moment(proposal.voting_start_time).format('DD-MMM-YYYY HH:mm:ss')
										: ''}
								</p>
								<p>
									{proposal && proposal.voting_end_time
										? moment(proposal.voting_end_time).format('DD-MMM-YYYY HH:mm:ss')
										: ''}
								</p>
							</div>
						</div>
						<div className="pds3l_c">
							<p className="pds3l_c1">Voting Status</p>
							<div
								className={ClassNames(
									'pds3l_c2 vote_details',
									proposal && proposal.status === 2 ? 'vote_in_progress' : ''
								)}>
								<div className="yes">
									<span />
									<p>YES ({voteCalculation('yes')})</p>
								</div>
								<div className="no">
									<span />
									<p>NO ({voteCalculation('no')})</p>
								</div>
								<div className="option3">
									<span />
									<p>NoWithVeto ({voteCalculation('no_with_veto')})</p>
								</div>
								<div className="option4">
									<span />
									<p>Abstain ({voteCalculation('abstain')})</p>
								</div>
							</div>
						</div>
						<div className="pds3l_c">
							<p className="pds3l_c1">Type</p>
							<p className="pds3l_c2 type">{proposal && proposal.content && proposal.content.type}</p>
						</div>
					</div>
					{proposal && proposal.status === 2 && !voteDetailsInProgress ? (
						<Voting proposalId={proposal && proposal.id} />
					) : null}
				</div>
				{votedOption ? (
					<div className="already_voted">
						<Icon className="right-arrow" icon="right-arrow" />
						<p>{`you voted “${
							votedOption && (votedOption.option === 1 || votedOption.option === 'VOTE_OPTION_YES')
								? 'Yes'
								: votedOption && (votedOption.option === 2 || votedOption.option === 'VOTE_OPTION_ABSTAIN')
								? 'Abstain'
								: votedOption && (votedOption.option === 3 || votedOption.option === 'VOTE_OPTION_NO')
								? 'No'
								: votedOption && (votedOption.option === 4 || votedOption.option === 'VOTE_OPTION_NO_WITH_VETO')
								? 'NoWithVeto'
								: votedOption && votedOption.option
						}” for this proposal`}</p>
					</div>
				) : null}
			</div>
		</div>
	);
});

export default ProposalDialog;
