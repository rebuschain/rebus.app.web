import { tally } from 'src/utils/number-formats';

export const voteCalculation = (
	tallyData: any,
	val: 'yes' | 'no' | 'no_with_veto' | 'abstain',
	rawNumber: boolean = false
): string | number => {
	const sum =
		tallyData &&
		tallyData.yes.toString() &&
		tallyData.no.toString() &&
		tallyData.noWithVeto.toString() &&
		tallyData.abstain.toString() &&
		parseInt(tallyData.yes.toString()) +
			parseInt(tallyData.no.toString()) +
			parseInt(tallyData.noWithVeto.toString()) +
			parseInt(tallyData.abstain.toString());

	const percentage = tallyData?.[val] ? tally(parseInt(tallyData[val].toString()), sum) : '0%';

	return rawNumber ? parseFloat(percentage.replace('%', '')) : percentage;
};
