export const proposalStatusText = (proposalStatus: string) => {
	switch (true) {
		case proposalStatus === 'PROPOSAL_STATUS_UNSPECIFIED':
			return 'Nil';
		case proposalStatus === 'PROPOSAL_STATUS_DEPOSIT_PERIOD':
			return 'Deposit Period';
		case proposalStatus === 'PROPOSAL_STATUS_VOTING_PERIOD':
			return 'Voting Period';
		case proposalStatus === 'PROPOSAL_STATUS_PASSED':
			return 'Passed';
		case proposalStatus === 'PROPOSAL_STATUS_REJECTED':
			return 'Rejected';
		case proposalStatus === 'PROPOSAL_STATUS_FAILED':
			return 'Failed';
		default:
			return '';
	}
};
