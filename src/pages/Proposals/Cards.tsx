import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import ClassNames from 'classnames';
import moment from 'moment';
import Icon from 'src/components/insync/Icon';
import { dialogActions } from 'src/reducers/slices';
import { tally } from 'src/utils/numberFormats';
import DotsLoading from 'src/components/insync/DotsLoading';
import { useActions } from 'src/hooks/useActions';
import { useAppSelector } from 'src/hooks/useAppSelect';
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
		<div className="cards_content">
			<div className="cards">
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
								<div key={index} className="card" onClick={() => handleShow(proposal)}>
									<div className="card_heading">
										<span className="number">{proposal.id}</span>
										<h2 onClick={() => handleShow(proposal)}>
											{' '}
											{proposal.content && proposal.content.value && proposal.content.value.title}
										</h2>
										{proposal.status === 3 ? (
											<Icon className="success" icon="success" />
										) : proposal.status === 2 && votedOption ? (
											<div className="details">
												<p>
													your vote is taken:{' '}
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
												</p>
												<Button variant="contained" onClick={() => handleShow(proposal)}>
													Details
												</Button>
											</div>
										) : proposal.status === 2 ? (
											<Button className="vote_button" variant="contained" onClick={() => handleShow(proposal)}>
												Vote
											</Button>
										) : null}
									</div>
									<p className="description">
										{proposal.content && proposal.content.value && proposal.content.value.description}
									</p>
									<div className="row">
										<div className="icon_info">
											<Icon className="person" icon="person" />
											<span className="key_text">
												Proposer &nbsp;/&nbsp;
												{inProgress ? (
													<DotsLoading />
												) : (
													proposer && (
														<div className="hash_text" title={proposer}>
															<p className="name">{proposer}</p>
															{proposer && proposer.slice(proposer.length - 6, proposer.length)}
														</div>
													)
												)}
											</span>
										</div>
										<p className="key_text">
											Submitted on &nbsp;/&nbsp;{' '}
											{proposal.submit_time ? moment(proposal.submit_time).format('DD-MMM-YYYY HH:mm:ss') : ''}
										</p>
									</div>
									<div className="row">
										<div className="icon_info">
											<Icon className="time" icon="time" />
											<p className="key_text">Voting Period</p>
											<p className="value_text">
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
											</p>
										</div>
									</div>
									<div
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
									</div>
									<div className="vote_details">
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
									</div>
								</div>
							);
						}

						return null;
					})}
			</div>
			{!home && (
				<div className="pagination">
					<Pagination count={count} page={page} onChange={handleChangePage} />
				</div>
			)}
		</div>
	);
};

export default Cards;
