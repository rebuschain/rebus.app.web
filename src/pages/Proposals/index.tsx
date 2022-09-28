import React, { FunctionComponent, useEffect, useState } from 'react';
import variables from 'src/utils/variables';
import { itemsActions, proposalDetailsActions, tallyDetailsActions } from 'src/reducers/slices';
import { InsyncWrapper } from 'src/components/insync/insync-wrapper';
import { useActions } from 'src/hooks/use-actions';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/use-app-select';
import UnSuccessDialog from '../stake/delegate-dialog/un-success-dialog';
import PendingDialog from '../stake/delegate-dialog/pending-dialog';
import SuccessDialog from '../stake/delegate-dialog/success-dialog';
import Cards from './cards';
import ProposalDialog from './proposal-dialog';
import './index.scss';

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

const Proposals: FunctionComponent = () => {
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

	return (
		<InsyncWrapper>
			<div className="proposals">
				{!open ? (
					<div className="proposals_content padding">
						<div className="heading">
							<div className="tabs">
								<p className={active === 1 ? 'active' : ''} onClick={() => handleChange(1)}>
									{variables[lang].all}
								</p>
								<span />
								<p className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
									{variables[lang].active}
								</p>
								<span />
								<p className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
									{variables[lang].pending}
								</p>
								<span />
								<p className={active === 4 ? 'active' : ''} onClick={() => handleChange(4)}>
									{variables[lang].closed}
								</p>
							</div>
						</div>
						{proposalsInProgress || voteDetailsInProgress ? (
							<div className="cards_content">Loading...</div>
						) : filteredProposals && filteredProposals.length ? (
							<Cards proposals={filteredProposals} />
						) : (
							<div className="cards_content">No data found</div>
						)}
					</div>
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

export default Proposals;
