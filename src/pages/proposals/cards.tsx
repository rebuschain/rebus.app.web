import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import styled from '@emotion/styled';
import ClassNames from 'classnames';
import moment from 'moment';
import Icon from 'src/components/insync/icon';
import { dialogActions } from 'src/reducers/slices';
import { tally } from 'src/utils/number-formats';
import DotsLoading from 'src/components/insync/dots-loading';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';

type CardsProps = {
	home?: boolean;
	proposals: any[];
};

const selector = (state: RootState) => ({
	proposalDetails: state.proposals.proposalDetails.value,
	proposalDetailsInProgress: state.proposals.proposalDetails.inProgress,
	voteDetails: state.proposals.voteDetails.value,
	tallyDetails: state.proposals.tallyDetails.value,
});

const Cards: FunctionComponent<CardsProps> = ({ home, proposals }) => {
	const [handleShow] = useActions([dialogActions.showProposalDialog]);

	const { proposalDetails, proposalDetailsInProgress, voteDetails, tallyDetails } = useAppSelector(selector);

	const [page, setPage] = useState(1);
	let rowsPerPage = 15;
	if (home) {
		rowsPerPage = 6;
	}

	const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
		setPage(page);
	};

	const count = Math.ceil(proposals.length / rowsPerPage);

	const reversedItems = proposals.length
		? proposals
				.map(function iterateItems(item) {
					return item;
				})
				.reverse()
		: [];

	const VoteCalculation = (proposal: any, val: 'yes' | 'no' | 'no_with_veto' | 'abstain') => {
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

	return (
		<>
			<div className="flex flex-wrap">
				{reversedItems.length &&
					reversedItems.map((proposal, index) => {
						if (index < page * rowsPerPage && index >= (page - 1) * rowsPerPage) {
							const votedOption =
								voteDetails &&
								voteDetails.length &&
								proposal &&
								proposal.id &&
								voteDetails.filter((vote: any) => vote.proposal_id === proposal.id)[0];
							let proposer = proposal.proposer;
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

							let inProgress =
								proposalDetails &&
								Object.keys(proposalDetails).length &&
								Object.keys(proposalDetails).find(key => key === proposal.id);
							inProgress = !inProgress && proposalDetailsInProgress;

							return (
								<Card key={index} onClick={() => handleShow(proposal)}>
									<div className="flex items-center justify-between mb-3.5">
										<Number>{proposal.id}</Number>
										<CardHeader onClick={() => handleShow(proposal)}>
											{' '}
											{proposal.content && proposal.content.value && proposal.content.value.title}
										</CardHeader>
										{proposal.status === 3 ? (
											<Icon className="success" icon="success" />
										) : proposal.status === 2 && votedOption ? (
											<div className="flex items-center w-full">
												<DetailsText>
													Your vote is taken:{' '}
													<b>
														{votedOption && votedOption.option === 1
															? 'Yes'
															: votedOption && votedOption.option === 2
															? 'Abstain'
															: votedOption && votedOption.option === 3
															? 'No'
															: votedOption && votedOption.option === 4
															? 'NoWithVeto'
															: votedOption && votedOption.option}
													</b>
												</DetailsText>
												<DetailsButton variant="contained" onClick={() => handleShow(proposal)}>
													Details
												</DetailsButton>
											</div>
										) : proposal.status === 2 ? (
											<VoteButton variant="contained" onClick={() => handleShow(proposal)}>
												Vote
											</VoteButton>
										) : null}
									</div>
									<ProposalContent>
										{proposal.content && proposal.content.value && proposal.content.value.description}
									</ProposalContent>
									<div className="flex items-center justify-between mb-4 flex-wrap">
										<IconInfo>
											<SmallIcon className="person" icon="person" />
											<KeyText>
												Proposer &nbsp;/&nbsp;
												{inProgress ? (
													<DotsLoading />
												) : (
													proposer && (
														<HashText title={proposer}>
															<p className="name">{proposer}</p>
															{proposer && proposer.slice(proposer.length - 6, proposer.length)}
														</HashText>
													)
												)}
											</KeyText>
										</IconInfo>
										<KeyText>
											Submitted on &nbsp;/&nbsp;{' '}
											{proposal.submit_time ? moment(proposal.submit_time).format('DD-MMM-YYYY HH:mm:ss') : ''}
										</KeyText>
									</div>
									<div className="flex items-center justify-between mb-4 flex-wrap">
										<IconInfo>
											<SmallIcon className="time" icon="time" />
											<KeyText>Voting Period</KeyText>
											<ValueText>
												{`${
													proposal && proposal.voting_start_time
														? moment(proposal.voting_start_time).format('DD-MMM-YYYY HH:mm:ss')
														: ''
												} -> 
                                                ${
																									proposal && proposal.voting_end_time
																										? moment(proposal.voting_end_time).format('DD-MMM-YYYY HH:mm:ss')
																										: ''
																								}`}
											</ValueText>
										</IconInfo>
									</div>
									<VotingStatus
										className={ClassNames(
											'status',
											proposal.status === 2 ? 'voting_period' : proposal.status === 4 ? 'rejected' : null
										)}>
										<p>
											Proposal Status:{' '}
											{proposal.status === 0
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
												: ''}
										</p>
									</VotingStatus>
									<VoteDetails>
										<div className="yes">
											<span />
											<p>YES ({VoteCalculation(proposal, 'yes')})</p>
										</div>
										<div className="no">
											<span />
											<p>NO ({VoteCalculation(proposal, 'no')})</p>
										</div>
										<div className="option3">
											<span />
											<p>NoWithVeto ({VoteCalculation(proposal, 'no_with_veto')})</p>
										</div>
										<div className="option4">
											<span />
											<p>Abstain ({VoteCalculation(proposal, 'abstain')})</p>
										</div>
									</VoteDetails>
								</Card>
							);
						}

						return null;
					})}
			</div>
			{!home && (
				<PaginationContainer>
					<Pagination count={count} page={page} onChange={handleChangePage} />
				</PaginationContainer>
			)}
		</>
	);
};

const Card = styled.div`
	background: rgba(45, 39, 85, 1);
	border-radius: 20px;
	color: #fff;
	cursor: pointer;
	margin-bottom: 20px;
	margin-right: 40px;
	padding: 18px 28px;
	position: relative;
	text-align: left;
	width: 31%;

	.icon-success {
		width: 32px;
	}

	&:nth-child(3n) {
		margin-right: unset;
	}

	@media (max-width: 1350px) {
		width: 46%;

		&:nth-child(3n) {
			margin-right: 40px;
		}

		&:nth-child(2n) {
			margin-right: unset;
		}
	}

	@media (max-width: 769px) {
		width: 100%;
		margin-right: unset;

		&:nth-child(3n) {
			margin-right: unset;
		}
	}
`;

const Number = styled.span`
	font-family: Poppins, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	background-image: linear-gradient(104.04deg, #e9d050 0%, #e99a50 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`;

const CardHeader = styled.h2`
	font-family: Poppins, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	line-height: 130%;
	color: #fff;
	margin: unset;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 80%;
`;

const DetailsText = styled.p`
	font-family: Poppins, ui-sans-serif, system-ui;
	font-size: 14px;
	text-align: right;
	color: rgba(255, 255, 255, 0.6);
	width: 100%;
	margin-left: 10px;
`;

const DetailsButton = styled(Button)`
	background: #eaeaea;
	border: 1px solid #cfcfcf;
	box-sizing: border-box;
	border-radius: 0.5em;
	box-shadow: unset;
	font-family: Poppins, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	text-align: right;
	color: #000000;
	margin-left: 10px;
	padding: 6px 20px;
`;

const VoteButton = styled(Button)`
	background: linear-gradient(135deg, #e95062, #e950d0 50%, #5084e9);
	border-radius: 0.5em;
	font-family: Poppins, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 16px;
	color: #fff;
	text-transform: unset;
	padding: 10px 20px;
	line-height: 1;
`;

const ProposalContent = styled.p`
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.6);
	margin-bottom: 26px;
	display: -webkit-box;
	-webkit-line-clamp: 5;
	-webkit-box-orient: vertical;
	overflow: hidden;
	height: 120px;

	@media (max-width: 958px) {
		margin-top: unset;
	}
`;

const KeyText = styled.p`
	flex-shrink: 0;
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.6);
	display: flex;
`;

const HashText = styled.p`
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.6);
	max-width: 110px;
`;

const IconInfo = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 4px;

	@media (max-width: 426px) {
		flex-wrap: wrap;
	}
`;

const SmallIcon = styled(Icon)`
	flex-shrink: 0;
	width: 18px;
	margin-right: 10px;
`;

const ValueText = styled.p`
	font-family: Inter, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 14px;
	color: #0085ff;
	margin-left: 10px;
`;

const VotingStatus = styled.div`
	display: flex;
	justify-content: center;
	margin: 20px 0;

	& > p {
		background: linear-gradient(104.04deg, #50e996 0%, #b8e950 100%);
		box-sizing: border-box;
		border-radius: 0.5em;
		width: 100%;
		font-family: Poppins, ui-sans-serif, system-ui;
		font-weight: 600;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.8);
		padding: 8px 20px;
		text-align: center;
	}

	&.voting_period > p {
		background: linear-gradient(104.04deg, #5084e9 0%, #6f50e9 100%);
	}

	&.rejected > p {
		background: linear-gradient(104.04deg, #e95062 0%, #e950d0 100%);
		color: #ffffff;
	}
`;

const VoteDetails = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;

	& > div {
		display: flex;
		align-items: center;
		margin-bottom: 10px;

		& > span {
			width: 16px;
			height: 16px;
			background: #02d70a;
			border-radius: 50px;
			flex-shrink: 0;
			margin-right: 10px;
		}

		& > p {
			font-family: Inter, ui-sans-serif, system-ui;
			font-size: 14px;
			color: rgba(255, 255, 255, 0.6);
			display: flex;
		}
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
`;

const PaginationContainer = styled.div`
	padding: 10px 20px;

	& > nav {
		display: flex;
		justify-content: flex-end;
	}

	li {
		& > button {
			font-family: Poppins, ui-sans-serif, system-ui;
			font-size: 14px;
			color: #ffffff;
			border-radius: 4px;
		}

		& > button[aria-current='true'] {
			background: #e1e1e1;
			box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
			color: #393939;
		}

		&:first-child > button svg,
		&:last-child > button svg {
			display: none;
		}

		&:first-child > button:before {
			content: 'Back';
			text-decoration: underline;
		}

		&:last-child > button:before {
			content: 'Next';
			text-decoration: underline;
		}
	}
`;

export default Cards;
