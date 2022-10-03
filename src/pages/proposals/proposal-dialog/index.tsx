import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton } from '@material-ui/core';
import styled from '@emotion/styled';
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

	useEffect(() => {
		return () => {
			handleClose();
		};
	}, [handleClose]);

	if (!open) {
		return null;
	}

	return (
		<div className="h-full w-full">
			<Content>
				<CloseButton onClick={handleClose}>
					<Icon className="icon" icon="close" />
				</CloseButton>
				<div className="flex items-center justify-between flex-col md:flex-row">
					<Section1Header>
						{proposal && proposal.content && proposal.content.value && proposal.content.value.title}
					</Section1Header>
					<Section1Status
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
					</Section1Status>
				</div>
			</Content>
			<ProposalContent>
				<Section2>
					<Section2Content className={ClassNames(show ? 'show_more' : '')}>
						{proposal && proposal.content && proposal.content.value && proposal.content.value.description}
					</Section2Content>
					<div className="underline cursor-pointer" onClick={handleChange}>
						{show ? 'Read Less...' : 'Read More...'}
					</div>
				</Section2>
				<Section3>
					<div className="flex flex-col">
						<Section3Row>
							<Section3RowLabel>Proposer</Section3RowLabel>
							{proposer && (
								<Section3RowValue className="pds3l_c2 hash_text" title={proposer}>
									<p className="name">{proposer}</p>
									{proposer && proposer.slice(proposer.length - 6, proposer.length)}
								</Section3RowValue>
							)}
						</Section3Row>
						<Section3Row>
							<Section3RowLabel>Submitted on</Section3RowLabel>
							<Section3RowValue>
								{proposal && proposal.submit_time ? moment(proposal.submit_time).format('DD-MMM-YYYY HH:mm:ss') : ''}
							</Section3RowValue>
						</Section3Row>
						<Section3Row>
							<Section3RowLabel>Voting Period</Section3RowLabel>
							<Section3RowValue className="vp_cards">
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
							</Section3RowValue>
						</Section3Row>
						<Section3Row>
							<Section3RowLabel>Voting Status</Section3RowLabel>
							<Section3RowValue
								className={ClassNames('vote_details', proposal && proposal.status === 2 ? 'vote_in_progress' : '')}>
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
							</Section3RowValue>
						</Section3Row>
						<Section3Row>
							<Section3RowLabel>Type</Section3RowLabel>
							<Section3RowValue className="type">
								{proposal && proposal.content && proposal.content.type}
							</Section3RowValue>
						</Section3Row>
					</div>
					{proposal && proposal.status === 2 && !voteDetailsInProgress ? (
						<Voting proposalId={proposal && proposal.id} />
					) : null}
				</Section3>
				{votedOption ? (
					<div className="flex items-center md:-ml-10">
						<VotedIcon className="right-arrow" icon="right-arrow" />
						<VotedContent>
							{`You voted “${
								votedOption && (votedOption.option === 1 || votedOption.option === 'VOTE_OPTION_YES')
									? 'Yes'
									: votedOption && (votedOption.option === 2 || votedOption.option === 'VOTE_OPTION_ABSTAIN')
									? 'Abstain'
									: votedOption && (votedOption.option === 3 || votedOption.option === 'VOTE_OPTION_NO')
									? 'No'
									: votedOption && (votedOption.option === 4 || votedOption.option === 'VOTE_OPTION_NO_WITH_VETO')
									? 'NoWithVeto'
									: votedOption && votedOption.option
							}” for this proposal`}
						</VotedContent>
					</div>
				) : null}
			</ProposalContent>
		</div>
	);
});

const Content = styled.div`
	width: 100%;
	height: 100%;
	padding: 40px;
	position: relative;

	@media (max-width: 769px) {
		padding: 30px;
	}

	@media (max-width: 426px) {
		padding: 20px;
	}
`;

const VotedIcon = styled(Icon)`
	width: 34px;
	margin-right: 20px;

	@media (max-width: 426px) {
		display: none;
	}
`;

const VotedContent = styled.p`
	background: #000000;
	border: 1px solid #696969;
	box-sizing: border-box;
	border-radius: 100px;
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	color: #ffffff;
	padding: 8px 40px;

	@media (max-width: 426px) {
		font-size: 18px;
		line-height: 110%;
		padding: 8px 20px;
	}
`;

const ProposalContent = styled.div`
	background-color: #231d4b;
	padding: 40px;

	@media (max-width: 426px) {
		padding: 20px;
	}
`;

const CloseButton = styled(IconButton)`
	position: absolute !important;
	right: 20px;
	top: 37px;

	.icon {
		fill: #ffffff;
		width: 20px;
	}
`;

const Section1Header = styled.div`
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	color: #ffffff;
	text-align: left;

	@media (max-width: 769px) {
		width: 100%;
	}

	@media (max-width: 426px) {
		font-size: 34px;
		text-align: center;
	}
`;

const Section1Status = styled.div`
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 18px;
	color: #fff;
	background: linear-gradient(104.04deg, #50e996 0%, #b8e950 100%);
	box-sizing: border-box;
	border-radius: 0.5em;
	padding: 3px 20px 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 50px;
	flex-shrink: 0;

	&.voting_period {
		background: linear-gradient(104.04deg, #5084e9 0%, #6f50e9 100%);
	}

	&.rejected {
		background: linear-gradient(104.04deg, #e95062 0%, #e950d0 100%);
		color: #ffffff;
	}

	@media (max-width: 769px) {
		&.proposal_dialog_section1_status {
			margin: unset;
		}
	}

	@media (max-width: 426px) {
		font-size: 16px;
		padding: 8px 20px;
	}
`;

const Section2 = styled.div`
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 14px;
	color: #ffffff;
	text-align: left;
`;

const Section2Content = styled.pre`
	height: 3.3em;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: pre-wrap;
	width: 100%;
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 15px;
	line-height: 25px;
	color: #ffffff;

	&.show_more {
		height: unset;
	}
`;

const Section3 = styled.div`
	margin-top: 30px;
	display: flex;
	justify-content: space-between;

	@media (max-width: 1025px) {
		flex-direction: column;
	}

	@media (max-width: 426px) {
		margin-top: 20px;
	}
`;

const Section3Row = styled.div`
	display: flex;
	align-items: flex-start;
	margin-bottom: 30px;

	&:nth-child(4) {
		margin-bottom: 20px;
	}

	@media (max-width: 426px) {
		flex-direction: column;
		margin-bottom: 30px;
	}
`;

const Section3RowLabel = styled.p`
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: bold;
	font-size: 14px;
	color: #ffffff;
	width: 220px;
	text-align: left;
	flex-shrink: 0;
	max-width: 23%;
`;

const Section3RowValue = styled.div`
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	color: #ffffff;
	text-align: left;
	flex: 1;
	display: flex;

	&.vp_cards {
		& > p {
			background: #f3f3f3;
			border-radius: 0.5em;
			font-family: Inter, ui-sans-serif, system-ui;
			font-size: 14px;
			color: #000000;
			padding: 8px 20px;
		}

		& > p:nth-child(2) {
			margin-left: 10px;
		}
	}

	&.vote_details {
		justify-content: space-between;
		flex-wrap: wrap;

		& > div > p {
			font-family: Inter, ui-sans-serif, system-ui;
			font-weight: 600;
			font-size: 14px;
			color: #ffffff;
		}

		&.vote_in_progress {
			flex-wrap: wrap;
			justify-content: space-between;

			& > div {
				width: 50%;
				margin-bottom: 30px;
			}
		}

		& > div {
			align-items: center;
			display: flex;
			margin-bottom: 10px;
		}

		& > div > span {
			width: 16px;
			height: 16px;
			background: #02d70a;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 10px;
		}

		& > .no > span {
			background: #c0c0c0;
		}

		& > .option3 > span {
			background: #ff6767;
		}

		& > .option4 > span {
			background: #827ce6;
		}
	}

	@media (max-width: 769px) {
		&.vp_cards {
			flex-wrap: wrap;

			& > p {
				margin: 2px;
			}
		}

		&.vote_details > div {
			width: 50%;
			margin-bottom: 30px;
		}
	}

	@media (max-width: 426px) {
		& > p {
			font-size: 20px;
		}

		&.vp_cards > p {
			font-size: 14px;
		}

		&.vote_details > div,
		&.vote_in_progress > div {
			width: 100%;
			margin-bottom: 20px;
		}

		&.type {
			word-break: break-all;
		}
	}
`;

export default ProposalDialog;
