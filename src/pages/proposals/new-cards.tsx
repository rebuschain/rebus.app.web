import React, { FunctionComponent, useEffect, useState } from 'react';
import { Pagination } from '@mui/lab';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { voteCalculation } from 'src/utils/vote-calculation';
import TooltipGraphSection from './tooltip-graph-section';
import { statusColor } from 'src/utils/color-formatter';
import { proposalStatusText } from 'src/utils/proposal-status';
import moment from 'moment';

type CardsProps = {
	proposals: any[];
};

const NewCards: FunctionComponent<React.PropsWithChildren<CardsProps>> = ({ proposals }) => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const rowsPerPage = 15;

	const handleClick = (id: string) => {
		navigate(`/proposals/${id}`);
	};

	const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
		setPage(page);
	};

	const shouldDisplayVoting = (proposal: any) => proposal.proposalStatus === 1;

	const count = Math.ceil(proposals.length / rowsPerPage);
	const startIndex = (page - 1) * rowsPerPage;

	return (
		<>
			<div className="flex flex-wrap">
				{proposals?.slice(startIndex, startIndex + rowsPerPage).map((proposal, index) => {
					return (
						<div onClick={() => handleClick(proposal.id)} key={index} className="w-full md:w-2/4 cursor-pointer">
							<div className="card bg-card p-4 mb-4 mr-0 md:mr-4 rounded-[20px]">
								<div className="flex justify-between items-center py-3">
									<Number>{proposal.id}</Number>
									<p
										className={`font-semibold ${
											proposal.proposalStatus === 3 || proposal.proposalStatus === 4
												? 'text-transparent bg-clip-text'
												: ''
										} ${statusColor(proposal.proposalStatus)}`}>
										{proposalStatusText(proposal.proposalStatus)}
									</p>
								</div>
								<div className="py-2 text-xl whitespace-nowrap overflow-hidden text-ellipsis">
									{proposal.title || proposal.content?.value?.title || proposal.content?.title}
								</div>
								<div className="flex justify-between">
									<div className="py-2 text-white-mid">
										<p className="py-0">Voting Start</p>
										<p className={`pt-1 text-votingBlue ${shouldDisplayVoting(proposal) && 'text-center'}`}>
											{shouldDisplayVoting(proposal)
												? '-'
												: moment(proposal.raw.voting_start_time).format('DD-MMM-YYYY HH:mm:ss')}
										</p>
									</div>
									<div className="py-2 text-white-mid">
										<p className="py-0">Voting End</p>
										<p className={`pt-1 text-votingBlue ${shouldDisplayVoting(proposal) && 'text-center'}`}>
											{shouldDisplayVoting(proposal)
												? '-'
												: moment(proposal.raw.voting_end_time).format('DD-MMM-YYYY HH:mm:ss')}
										</p>
									</div>
								</div>
								<div className="py-4">
									<div className="flex w-full h-7 bg-white-mid">
										<TooltipGraphSection tooltipTitle={`Yes ${voteCalculation(proposal, 'yes')}`}>
											<div
												className="h-7 bg-gradient-pass"
												style={{
													width: voteCalculation(proposal, 'yes'),
												}}
											/>
										</TooltipGraphSection>
										<TooltipGraphSection tooltipTitle={`No ${voteCalculation(proposal, 'no')}`}>
											<div
												className="h-7 bg-gradient-rejected"
												style={{
													width: voteCalculation(proposal, 'no'),
												}}
											/>
										</TooltipGraphSection>
										<TooltipGraphSection tooltipTitle={`No with veto ${voteCalculation(proposal, 'no_with_veto')}`}>
											<div
												className="h-7 bg-error"
												style={{
													width: voteCalculation(proposal, 'no_with_veto'),
												}}
											/>
										</TooltipGraphSection>
										<TooltipGraphSection tooltipTitle={`Abstain ${voteCalculation(proposal, 'abstain')}`}>
											<div
												className="h-7 bg-primary-50"
												style={{
													width: voteCalculation(proposal, 'abstain'),
												}}
											/>
										</TooltipGraphSection>
									</div>
								</div>
								<div className="flex justify-between">
									<div className="py-2">
										<div className="flex items-center pb-1">
											<span className="h-4 w-4 mr-3 shrink-0 rounded-full bg-gradient-pass" />
											<p>Yes {voteCalculation(proposal, 'yes')}</p>
										</div>
										<div className="flex items-center pb-1">
											<span className="h-4 w-4 mr-3 shrink-0 rounded-full bg-error" />
											<p>No With Veto {voteCalculation(proposal, 'no_with_veto')}</p>
										</div>
									</div>
									<div className="py-2">
										<div className="flex items-center pb-1">
											<span className="h-4 w-4 mr-3 shrink-0 rounded-full bg-gradient-rejected" />
											<p>No {voteCalculation(proposal, 'no')}</p>
										</div>
										<div className="flex items-center pb-1">
											<span className="h-4 w-4 mr-3 shrink-0 rounded-full bg-primary-50" />
											<p>Abstain {voteCalculation(proposal, 'abstain')}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					);

					return null;
				})}
			</div>
			<PaginationContainer>
				<Pagination count={count} page={page} onChange={handleChangePage} />
			</PaginationContainer>
		</>
	);
};

const Number = styled.span`
	font-family: Poppins, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	background-image: linear-gradient(104.04deg, #e9d050 0%, #e99a50 100%);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
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

export default NewCards;
