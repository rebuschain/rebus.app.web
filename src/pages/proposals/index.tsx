import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import variables from 'src/utils/variables';
import { itemsActions, proposalDetailsActions, tallyDetailsActions } from 'src/reducers/slices';
import { InsyncWrapper } from 'src/components/insync/insync-wrapper';
import { useActions } from 'src/hooks/use-actions';
import { RootState } from 'src/reducers/store';
import { Loader } from 'src/components/common/loader';
import { useAppSelector } from 'src/hooks/use-app-select';
import UnSuccessDialog from '../stake/delegate-dialog/un-success-dialog';
import PendingDialog from '../stake/delegate-dialog/pending-dialog';
import SuccessDialog from '../stake/delegate-dialog/success-dialog';
import { useStore } from 'src/stores';
import Cards from './cards';
import ProposalDialog from './proposal-dialog';
import ProposalsPage from './new-index';

const selector = (state: RootState) => {
	return {
		proposals: state.proposals.items.list,
		proposalsInProgress: state.proposals.items.inProgress,
		proposalDetails: state.proposals.proposalDetails.value,
		lang: state.language,
		open: state.proposals.dialog.open,
		voteDetails: state.proposals.voteDetails.value,
		voteDetailsInProgress: state.proposals.voteDetails.inProgress,
	};
};

const Proposals: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const { featureFlagStore } = useStore();
	const [featureFlags, setFeatureFlags] = useState<any[] | undefined>([]);

	useEffect(() => {
		(async () => {
			const flags = await featureFlagStore.waitResponse();
			setFeatureFlags(flags?.data.data);
		})();
	}, [featureFlagStore]);

	const [getProposals, fetchProposalDetails, fetchProposalTally] = useActions([
		itemsActions.getProposals,
		proposalDetailsActions.getProposalDetails,
		tallyDetailsActions.getTallyDetails,
	]);

	const { proposals, proposalsInProgress, lang, open, proposalDetails, voteDetailsInProgress } = useAppSelector(
		selector
	);

	const [active, setActive] = useState(1);
	const [filter, setFilter] = useState<number | null>(null);

	const getProposalDetails = (data: any) => {
		if (data && data.length && data[0]) {
			fetchProposalDetails({
				id: data[0],
				callback: () => {
					if (data[1]) {
						data.splice(0, 1);
						getProposalDetails(data);
					}
				},
			});
		}
	};

	const handleChange = (value: any) => {
		if (active === value) {
			return;
		}

		setActive(value);
		setFilter(value === null ? 2 : value === 2 ? 3 : value === 3 ? 2 : value === 4 ? 4 : null);
	};
	const filteredProposals = filter ? proposals.filter(item => item.status === filter) : proposals;

	const fetchProposals = () => {
		if (proposals && !proposals.length && !proposalsInProgress) {
			getProposals((result: any) => {
				if (result && result.length) {
					const array: any[] = [];
					result.map((val: any) => {
						const filter =
							proposalDetails &&
							Object.keys(proposalDetails).length &&
							Object.keys(proposalDetails).find(key => key === val.id);
						if (!filter) {
							if (val.status !== 2) {
								return null;
							}

							array.push(val.id);
						}
						if (val.status === 2) {
							fetchProposalTally(val.id);
						}

						return null;
					});
					getProposalDetails(array && array.reverse());
				}
			});
		}
	};

	useEffect(() => {
		fetchProposals();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!featureFlagStore.error && (featureFlagStore.isFetching || !featureFlagStore.response)) {
		return <Loader />;
	}

	if (featureFlagStore.featureFlags.newProposals) {
		return <ProposalsPage />;
	}

	return (
		<InsyncWrapper>
			<div className="p-2.5 pt-20 md:p-0 md:pt-0">
				{!open ? (
					<ProposalContent>
						<div className="flex items-center justify-between">
							<div className="flex items-center ml-10">
								<TabLabel className={active === 1 ? 'active' : ''} onClick={() => handleChange(1)}>
									{variables[lang].all}
								</TabLabel>
								<Divider />
								<TabLabel className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
									{variables[lang].active}
								</TabLabel>
								<Divider />
								<TabLabel className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
									{variables[lang].pending}
								</TabLabel>
								<Divider />
								<TabLabel className={active === 4 ? 'active' : ''} onClick={() => handleChange(4)}>
									{variables[lang].closed}
								</TabLabel>
							</div>
						</div>
						<CardsContent>
							{proposalsInProgress || voteDetailsInProgress ? (
								'Loading...'
							) : filteredProposals && filteredProposals.length ? (
								<Cards proposals={filteredProposals} />
							) : (
								'No data found'
							)}
						</CardsContent>
					</ProposalContent>
				) : (
					<ProposalDialog />
				)}
				<UnSuccessDialog />
				<PendingDialog />
				<SuccessDialog />
			</div>
		</InsyncWrapper>
	);
};

const ProposalContent = styled.div`
	margin-top: 30px;

	@media (max-width: 958px) {
		margin-top: unset;
	}
`;

const CardsContent = styled.div`
	border-radius: 10px;
	margin-top: 16px;
	padding: 38px;

	@media (max-width: 769px) {
		background: unset;
		padding: 0;
		backdrop-filter: unset;
		border-radius: unset;
	}
`;

const TabLabel = styled.p`
	cursor: pointer;
	font-family: Poppins, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	color: rgba(255, 255, 255, 0.6);

	&.active {
		color: #ffffff;
	}

	@media (max-width: 768px) {
		font-size: 20px;
	}
`;

const Divider = styled.span`
	border: 1px solid #ffffff;
	height: 22px;
	margin: 0 20px;

	@media (max-width: 768px) {
		margin: 0 14px;
	}
`;

export default Proposals;
