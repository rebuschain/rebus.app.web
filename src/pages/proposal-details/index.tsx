import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect } from 'react';
import { useStore } from 'src/stores';
import { useHistory, useParams } from 'react-router-dom';
import { Loader } from 'src/components/common/loader';
import { VictoryContainer, VictoryPie, VictoryTooltip } from 'victory';
import { voteCalculation } from 'src/utils/vote-calculation';
import { statusColor } from 'src/utils/color-formatter';
import { proposalStatusText } from 'src/utils/proposal-status';
import UnSuccessDialog from '../stake/delegate-dialog/un-success-dialog';
import PendingDialog from '../stake/delegate-dialog/pending-dialog';
import SuccessDialog from '../stake/delegate-dialog/success-dialog';
import BackButton from 'src/components/insync/back-button';
import Voting from './voting';
import moment from 'moment';
import 'src/styles/insync.scss';

interface ProposalDetailParam {
	proposalId: string;
}

interface ProposalContent {
	type: string;
	value: {
		title: string;
		description: string;
	};
}

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const PieChart = (proposal: any) => {
	const data = [
		{
			label: 'Yes',
			x: 'Yes',
			y: voteCalculation(proposal, 'yes', true),
		},
		{ label: 'No', x: 'No', y: voteCalculation(proposal, 'no', true) },
		{
			label: 'No with Veto',
			x: 'No V',
			y: voteCalculation(proposal, 'no_with_veto', true),
		},
		{ label: 'Abstain', x: 'Abstain', y: voteCalculation(proposal, 'abstain', true) },
	];

	return (
		<>
			<svg className="absolute">
				<defs>
					<linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#50e996" />
						<stop offset="100%" stopColor="#b8e950" />
					</linearGradient>
					<linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="rgb(233, 80, 98)" />
						<stop offset="100%" stopColor="rgb(233, 80, 208)" />
					</linearGradient>
				</defs>
			</svg>
			<VictoryPie
				data={data}
				labelComponent={<VictoryTooltip style={{ fontSize: '30px' }} />}
				containerComponent={<VictoryContainer />}
				animate={{
					duration: 1000,
				}}
				colorScale={['url(#gradient1)', 'url(#gradient2)', '#EF3456', '#8A86FF']}
			/>
		</>
	);
};

const formatLinks = (txt: string) => {
	return txt.split(' ').map(part =>
		URL_REGEX.test(part) ? (
			<a className="text-primary-50" target="_blank" href={part} rel="noreferrer">
				{part}{' '}
			</a>
		) : (
			part + ' '
		)
	);
};

const descriptionFormatter = (text: string) => {
	return text.split('\\n\\n').map((str, index) => (
		<p className="my-1.5" key={index}>
			{formatLinks(str)}
		</p>
	));
};

const typeFormatter = (text: string) => {
	const statusSegments = text.split('/');

	return statusSegments[1].split(/(?=[A-Z])/).join(' ');
};

const ProposalDetailPage: FunctionComponent = observer(() => {
	const { proposalId } = useParams<ProposalDetailParam>();
	const history = useHistory();
	const { chainStore, queriesStore, walletStore, accountStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const queries = queriesStore.get(chainStore.current.chainId);
	const proposal = queries.cosmos.queryGovernance.getProposal(proposalId);
	const votedOption = queries.cosmos.queryProposalVote.getVote(proposalId, address);

	const shouldDisplayVoting = (proposal: any) => proposal.proposalStatus === 1 || proposal.proposalStatus === 2;
	const onBackButtonClick = () => {
		history.go(-1);
	};

	// TODO: remove once we refactor dialogs
	useEffect(() => {
		document.body.classList.add('insync');
		return () => document.body.classList.remove('insync');
	}, []);

	if (!proposal || !queries) {
		return <Loader />;
	}

	return (
		<div className="flex w-full p-2.5 pt-20 md:p-0 md:pt-0">
			<div className="flex w-full lg:mt-7.5 mt-0">
				<div className="proposals flex flex-col w-full ">
					<div className="flex flex-wrap justify-center w-full md:w-auto py-4 px-10">
						<div className="flex flex-wrap justify-center w-full px-4">
							<div className="details-header justify-between w-full px-4 bg-card rounded-2xl">
								<div className="flex justify-between items-center">
									<div className="flex items-center font-semibold text-md md:text-xl py-4 text-white-high">
										<BackButton onClick={onBackButtonClick} />
										<p>
											Proposal #{proposalId} <span className="font-thin text-base pl-2">{proposal.title}</span>
										</p>
									</div>
									<p
										className={`font-semibold rounded-lg text-white-high text-lg px-5 py-1 ${statusColor(
											proposal.proposalStatus
										)} `}>
										Proposal Status: {proposalStatusText(proposal.proposalStatus)}
									</p>
								</div>
							</div>
						</div>

						{proposal?.proposalStatus === 2 ? (
							<div className="voting-section flex flex-wrap justify-center w-full px-4 mt-4 mb-0">
								<div className="w-full bg-card p-4 rounded-2xl">
									<div className="flex justify-between items-center">
										<p className="font-semibold text-base text-white-high">Please choose your vote</p>
									</div>
									<div className="mt-4 text-sm">
										<div id="marked">
											<Voting proposalId={parseInt(proposal?.id)} />
										</div>
										{votedOption ? (
											<div className="mt-4 text-sm">
												<b>You voted for {votedOption.vote}</b>
											</div>
										) : null}
									</div>
								</div>
							</div>
						) : null}

						<div className="flex flex-wrap justify-center w-full p-4">
							<div className="md:w-1/2 w-full text-base">
								<div className="h-full justify-between bg-card p-4 rounded-2xl mr-0 md:mr-4">
									<div className="flex items-center mb-4">
										<div className="w-3/4 md:w-3/4 ellipsis">
											<p className="font-semibold text-base text-white-high">Voting Details</p>
											<p className="text-sm text-blue-400" />
										</div>
									</div>
									<div className="flex mt-4">
										<div className="w-1/3" />
										<div className="w-2/3 text-right" />
									</div>
									<div className="flex mt-4">
										<div className="w-1/3 text-white-mid">Proposal Type</div>
										<div className="w-2/3 text-right text-white-mid">
											{typeFormatter((proposal.raw.content as ProposalContent).type)}
										</div>
									</div>
									<div className="flex mt-4">
										<div className="w-1/3 text-white-mid">Voting Start</div>
										<div className="w-2/3 text-right text-votingBlue">
											{proposal.proposalStatus === 1
												? '-'
												: moment(proposal.raw.voting_start_time).format('DD-MMM-YYYY HH:mm:ss')}
										</div>
									</div>
									<div className="flex mt-4">
										<div className="w-1/3 text-white-mid">Voting End</div>
										<div className={`w-2/3 text-right text-votingBlue`}>
											{proposal.proposalStatus === 1
												? '-'
												: moment(proposal.raw.voting_end_time).format('DD-MMM-YYYY HH:mm:ss')}
										</div>
									</div>
									<div className="flex mt-4">
										<div className="w-1/3 text-white-mid">Submit Time</div>
										<div className="w-2/3 text-right text-votingBlue">
											{moment(proposal.raw.submit_time).format('DD-MMM-YYYY HH:mm:ss')}
										</div>
									</div>
									<div className="flex mt-4">
										<div className="w-1/3 text-white-mid">Deposit End Time</div>
										<div className="w-2/3 text-right text-votingBlue">
											{moment(proposal.raw.deposit_end_time).format('DD-MMM-YYYY HH:mm:ss')}
										</div>
									</div>
								</div>
							</div>
							<div className="w-full md:w-1/2 md:mt-0 text-base">
								<div className="h-full bg-card p-4 rounded-2xl mt-4 md:mt-0">
									<div className="flex justify-between items-center">
										<div>
											<p className="font-semibold text-base text-white-high">
												Voting period is {shouldDisplayVoting(proposal) && 'not'} over
											</p>
										</div>
									</div>
									<div className="flex flex-wrap items-center justify-between ">
										<div className=" items-center w-full md:w-1/2 p-0">
											<div className="flex items-center mx-auto w-1/2 relative">{proposal && PieChart(proposal)}</div>
										</div>
										<div className="w-full md:w-1/2">
											<div className="flex flex-wrap flex-col text-white-mid text-base w-1/2 md:mx-auto">
												<div className="flex items-center py-2 w-full">
													<span className="mr-4 rounded-full shrink-0 bg-gradient-pass min-h-4 min-w-4 h-4 w-4" />
													<p>Yes {voteCalculation(proposal, 'yes')}</p>
												</div>
												<div className="flex items-center py-2 w-full">
													<span className="mr-4 rounded-full shrink-0 bg-gradient-rejected min-h-4 min-w-4 h-4 w-4" />
													<p> No {voteCalculation(proposal, 'no')}</p>
												</div>
												<div className="flex items-center py-2 w-full">
													<span className="mr-4 rounded-full shrink-0 bg-error min-h-4 min-w-4 h-4 w-4" />
													<p>No With Veto {voteCalculation(proposal, 'no_with_veto')}</p>
												</div>
												<div className="flex items-center py-2 w-full">
													<span className="mr-4 rounded-full shrink-0 bg-primary-50 min-h-4 min-w-4 h-4 w-4" />
													<p>Abstain {voteCalculation(proposal, 'abstain')}</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="proposal-description flex flex-wrap justify-center w-full px-4 pb-4 mt-4 md:mt-0">
							<div className="w-full bg-card p-4 rounded-2xl">
								<div className="flex justify-between items-center">
									<p className="font-semibold text-base text-white-high">Description</p>
								</div>
								<div className="mt-4 text-sm">
									<div id="marked">
										<p className="text-white-mid">{descriptionFormatter(proposal?.description)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<UnSuccessDialog />
			<PendingDialog />
			<SuccessDialog />
		</div>
	);
});

export default ProposalDetailPage;
