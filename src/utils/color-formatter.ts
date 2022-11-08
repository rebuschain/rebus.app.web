export const statusColor = (status: number) => {
	switch (status) {
		case 1:
			return 'text-enabledGold';
		case 2:
			return 'text-enabledGold';
		case 3:
			return 'bg-gradient-pass';
		case 4:
			return 'bg-gradient-rejected';

		default:
			return 'text-white-high';
	}
};
