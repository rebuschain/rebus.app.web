import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { observer } from 'mobx-react-lite';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { RootState } from 'src/reducers/store';
import { useAddress } from 'src/hooks/useAddress';
import variables from '../../utils/variables';
import DelegateDialog from '../Stake/DelegateDialog';
import SuccessDialog from '../Stake/DelegateDialog/SuccessDialog';
import UnSuccessDialog from '../Stake/DelegateDialog/UnSuccessDialog';
import Table from '../Stake/Table';
import PendingDialog from '../Stake/DelegateDialog/PendingDialog';
import { InsyncWrapper } from '../../components/insync/InsyncWrapper';
import ClaimDialog from './ClaimDialog';
import TokenDetails from './TokenDetails';
import './index.scss';

type HomeProps = RouteComponentProps<any>;

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.proposals.dialog.open,
		proposals: state.proposals.items.list,
		proposalsInProgress: state.proposals.items.inProgress,
		voteDetailsInProgress: state.proposals.voteDetails.inProgress,
	};
};

const Home = observer<HomeProps>(({ history }) => {
	const { lang, open, proposals, proposalsInProgress, voteDetailsInProgress } = useAppSelector(selector);
	const address = useAddress();
	const addressConnected = useRef(false);

	const [active, setActive] = useState(1);
	const filteredProposals = proposals && proposals.filter(item => item.status === 2);
	const langVariables = (variables as any)[lang] as { [key: string]: string };

	useEffect(() => {
		if (!address) {
			addressConnected.current = false;
			setActive(1);
		}

		if (address !== '' && !addressConnected.current) {
			addressConnected.current = true;
			setActive(2);
		}
	}, [address]);

	return (
		<InsyncWrapper>
			<div className="home">
				<h4>{langVariables.welcome}</h4>
				<div className="card">
					{/*<p className="info">{langVariables.participate}</p>*/}
					<TokenDetails lang={lang} />
				</div>
			</div>
			<div className="stake">
				<div className="stake_content padding">
					<div className="heading">
						<div className="tabs">
							<p className={active === 2 ? 'active' : ''} onClick={() => setActive(2)}>
								{langVariables['staked_validators']}
							</p>
							<span />
							<p className={active === 1 ? 'active' : ''} onClick={() => setActive(1)}>
								{langVariables['all_validators']}
							</p>
							<span />
							<p className={active === 3 ? 'active' : ''} onClick={() => setActive(3)}>
								{langVariables['inactive_validators']}
							</p>
						</div>
					</div>
					<Table active={active} />
				</div>
			</div>
			{/*<div className="proposals">
				{!open ? (
					<div className="proposals_content padding">
						<div className="heading">
							<div className="tabs">
								<p className="active">{langVariables['top_active_proposals']}</p>
							</div>
							<Button className="view_all" onClick={() => history.push('/proposals')}>
								{langVariables['view_all']}
							</Button>
						</div>
						{proposalsInProgress || voteDetailsInProgress ? (
							<div className="cards_content">Loading...</div>
						) : filteredProposals && filteredProposals.length ? (
							<Cards home={true} proposals={filteredProposals} />
						) : (
							<div className="cards_content">{langVariables['no_data_found']}</div>
						)}
					</div>
				) : (
					<ProposalDialog />
				)}
				</div>*/}
			<DelegateDialog canDelegateToInactive={active === 3} />
			<SuccessDialog />
			<UnSuccessDialog />
			<PendingDialog />
			<ClaimDialog />
		</InsyncWrapper>
	);
});

export default withRouter(Home);
