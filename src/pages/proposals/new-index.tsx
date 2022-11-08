import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useMemo, useState } from 'react';
import variables from 'src/utils/variables';
import { RootState } from 'src/reducers/store';
import { Loader } from 'src/components/common/loader';
import { useStore } from 'src/stores';
import { useAppSelector } from 'src/hooks/use-app-select';
import NewCards from './new-cards';
import { ProposalStatus } from '@keplr-wallet/stores/build/query/cosmos/governance/types';

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const PENDING_STATUS = 'pending';

const ProposalsPage: FunctionComponent = observer(() => {
	const { chainStore, queriesStore } = useStore();
	const queries = queriesStore.get(chainStore.current.chainId);
	const proposals = queries.cosmos.queryGovernance.proposals;

	const { lang } = useAppSelector(selector);
	const [active, setActive] = useState<number | string | null>(ProposalStatus.UNSPECIFIED);
	const [filter, setFilter] = useState<number | string | null>(ProposalStatus.UNSPECIFIED);

	const handleChange = (value: number | string) => {
		if (active === value) {
			return;
		}

		setActive(value);
		setFilter(value);
	};
	const filteredProposals = useMemo(() => {
		return filter !== ProposalStatus.UNSPECIFIED
			? proposals.filter(item => {
					if (filter === PENDING_STATUS) {
						return (
							item.proposalStatus === ProposalStatus.DEPOSIT_PERIOD ||
							item.proposalStatus === ProposalStatus.VOTING_PERIOD
						);
					}

					return item.proposalStatus === filter;
			  })
			: proposals;
	}, [proposals, filter]);

	const proposalCounts = useMemo(() => {
		const all = proposals.length;
		let passed = 0;
		let pending = 0;
		let rejected = 0;

		proposals.forEach(proposal => {
			if (
				proposal.proposalStatus === ProposalStatus.DEPOSIT_PERIOD ||
				proposal.proposalStatus === ProposalStatus.VOTING_PERIOD
			) {
				pending++;
			}
			if (proposal.proposalStatus === ProposalStatus.PASSED) {
				passed++;
			}
			if (proposal.proposalStatus === ProposalStatus.REJECTED) {
				rejected++;
			}
		});

		return {
			all,
			passed,
			pending,
			rejected,
		};
	}, [proposals]);

	if (!proposals || !queries) {
		return <Loader />;
	}

	return (
		<div className="flex proposals flex-col w-full p-2.5 pt-20 md:p-0 md:pt-0 lg:mt-7.5 mt-0">
			<div className="flex flex-wrap justify-center w-full p-4 ">
				<div className="justify-between w-full md:px-10 rounded-2xl">
					<div className="flex justify-between">
						<p className="font-semibold md:text-xl text-lg  py-4 text-white">Rebus Proposals</p>
						<div className="flex flex-wrap items-center justify-center">
							<p className="font-semibold md:text-xl text-lg px-1 text-primary-50">
								<button
									type="button"
									className="hover:border-b-2 text-primary-50"
									onClick={() => handleChange(ProposalStatus.UNSPECIFIED)}>
									<span>{proposals.length}</span>
									<span
										className={`${
											active === ProposalStatus.UNSPECIFIED ? 'active' : ''
										} font-thin text-sm pl-1 text-primary-50`}>
										{variables[lang].all}
									</span>
								</button>
							</p>
							<p className="font-semibold md:text-xl text-lg px-1 text-transparent bg-clip-text bg-gradient-pass">
								<button
									type="button"
									className="cursor-pointer hover:border-b-2 text-transparent bg-clip-text bg-gradient-pass"
									onClick={() => handleChange(ProposalStatus.PASSED)}>
									<span>{proposalCounts.passed}</span>
									<span
										className={`${
											active === ProposalStatus.PASSED ? 'active' : ''
										} font-thin text-sm pl-1 text-transparent bg-clip-text bg-gradient-pass`}>
										{variables[lang].active}
									</span>
								</button>
							</p>
							<p className="font-semibold md:text-xl text-lg px-1 text-enabledGold">
								<button
									type="button"
									className="cursor-pointer hover:border-b-2 text-enabledGold"
									onClick={() => handleChange(PENDING_STATUS)}>
									<span>{proposalCounts.pending}</span>
									<span
										className={`${active === PENDING_STATUS ? 'active' : ''} font-thin text-sm pl-1 text-enabledGold`}>
										{variables[lang].pending}
									</span>
								</button>
							</p>
							<p className="font-semibold md:text-xl text-lg px-1 text-transparent bg-clip-text bg-gradient-rejected">
								<button
									type="button"
									className="cursor-pointer hover:border-b-2 text-transparent bg-clip-text bg-gradient-rejected"
									onClick={() => handleChange(ProposalStatus.REJECTED)}>
									<span>{proposalCounts.rejected}</span>
									<span
										className={`${
											active === ProposalStatus.REJECTED ? 'active' : ''
										} font-thin text-sm pl-1 text-transparent bg-clip-text bg-gradient-rejected`}>
										{variables[lang].closed}
									</span>
								</button>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="cards-content md:px-10 md:py-14">
				<NewCards proposals={[...filteredProposals]} />
			</div>
		</div>
	);
});

export default ProposalsPage;
