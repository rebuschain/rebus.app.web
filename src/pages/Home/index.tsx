import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import variables from '../../utils/variables';
import DelegateDialog from '../Stake/DelegateDialog';
import SuccessDialog from '../Stake/DelegateDialog/SuccessDialog';
import UnSuccessDialog from '../Stake/DelegateDialog/UnSuccessDialog';
import Table from '../Stake/Table';
import Cards from '../Proposals/Cards';
import ProposalDialog from '../Proposals/ProposalDialog';
import PendingDialog from '../Stake/DelegateDialog/PendingDialog';
import { InsyncWrapper } from '../../components/insync/InsyncWrapper';
import ClaimDialog from './ClaimDialog';
import TokenDetails from './TokenDetails';
import './index.scss';

// TODO: Refactor types
type Proposal = {
	status: number;
};

interface HomeProps extends RouteComponentProps<any> {
	address: string;
	lang: string;
	proposals: Array<Proposal>;
}

type HomeState = {
	active: number;
};

class Home extends Component<HomeProps, HomeState> {
	constructor(props: HomeProps) {
		super(props);

		this.state = {
			active: 1,
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleRedirect = this.handleRedirect.bind(this);
	}

	componentDidMount() {
		if (this.props.address !== '' && this.state.active !== 2) {
			this.setState({
				active: 2,
			});
		}
	}

	componentDidUpdate(pp: HomeProps, ps: HomeState, ss: HomeState) {
		if (pp.address !== this.props.address && this.props.address !== '' && this.state.active !== 2) {
			this.setState({
				active: 2,
			});
		}
		if (pp.address !== this.props.address && this.props.address === '' && this.state.active !== 1) {
			this.setState({
				active: 1,
			});
		}
	}

	handleChange(value: number) {
		if (this.state.active === value) {
			return;
		}

		this.setState({
			active: value,
		});
	}

	handleRedirect(value: string) {
		this.props.history.push(value);
	}

	render() {
		const { active } = this.state;
		const filteredProposals = this.props.proposals && this.props.proposals.filter(item => item.status === 2);
		const langVariables = (variables as any)[this.props.lang] as { [key: string]: string };

		return (
			<InsyncWrapper>
				<div className="home">
					<h4>{langVariables.welcome}</h4>
					<div className="card">
						{/*<p className="info">{langVariables.participate}</p>*/}
						<TokenDetails lang={this.props.lang} />
					</div>
				</div>
				<div className="stake">
					<div className="stake_content padding">
						<div className="heading">
							<div className="tabs">
								<p className={active === 2 ? 'active' : ''} onClick={() => this.handleChange(2)}>
									{langVariables['staked_validators']}
								</p>
								<span />
								<p className={active === 1 ? 'active' : ''} onClick={() => this.handleChange(1)}>
									{langVariables['all_validators']}
								</p>
							</div>
							<Button className="view_all" onClick={() => this.handleRedirect('/staking')}>
								{langVariables['view_all']}
							</Button>
						</div>
						<Table active={active} home={true} />
					</div>
				</div>
				{/*<div className="proposals">
					{!this.props.open ? (
						<div className="proposals_content padding">
							<div className="heading">
								<div className="tabs">
									<p className="active">{langVariables['top_active_proposals']}</p>
								</div>
								<Button className="view_all" onClick={() => this.handleRedirect('/proposals')}>
									{langVariables['view_all']}
								</Button>
							</div>
							{this.props.proposalsInProgress || this.props.voteDetailsInProgress ? (
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
				<DelegateDialog />
				<SuccessDialog />
				<UnSuccessDialog />
				<PendingDialog />
				<ClaimDialog />
			</InsyncWrapper>
		);
	}
}

const stateToProps = (state: any) => {
	return {
		address: state.accounts.address.value,
		lang: state.language,
		open: state.proposals.dialog.open,
		proposals: state.proposals._.list,
		proposalsInProgress: state.proposals._.inProgress,
		voteDetailsInProgress: state.proposals.voteDetails.inProgress,
	};
};

export default withRouter(connect(stateToProps)(Home));
