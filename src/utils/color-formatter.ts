export const statusColor = (status: string) => {
	switch (status) {
		case 'PROPOSAL_STATUS_DEPOSIT_PERIOD':
			return 'text-enabledGold';
		case 'PROPOSAL_STATUS_VOTING_PERIOD':
			return 'text-enabledGold';
		case 'PROPOSAL_STATUS_PASSED':
			return 'bg-gradient-pass';
		case 'PROPOSAL_STATUS_REJECTED':
			return 'bg-gradient-rejected';

		default:
			return 'text-white-high';
	}
};
