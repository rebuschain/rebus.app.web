export const proposalStatusText = (proposalStatus: number) => {
	switch (true) {
		case proposalStatus === 0:
			return 'Nil';
		case proposalStatus === 1:
			return 'Deposit Period';
		case proposalStatus === 2:
			return 'Voting Period';
		case proposalStatus === 3:
			return 'Passed';
		case proposalStatus === 4:
			return 'Rejected';
		case proposalStatus === 5:
			return 'Failed';
		default:
			return '';
	}
};
