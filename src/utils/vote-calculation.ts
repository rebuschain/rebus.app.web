import { tally } from 'src/utils/number-formats';

export const voteCalculation = (
	proposal: any,
	val: 'yes' | 'no' | 'no_with_veto' | 'abstain',
	rawNumber: boolean = false
): string | number => {
	if (proposal.proposalStatus === 2) {
		const sum =
			proposal.tally &&
			proposal.tally.yes.toString() &&
			proposal.tally.no.toString() &&
			proposal.tally.noWithVeto.toString() &&
			proposal.tally.abstain.toString() &&
			parseInt(proposal.tally.yes.toString()) +
				parseInt(proposal.tally.no.toString()) +
				parseInt(proposal.tally.noWithVeto.toString()) +
				parseInt(proposal.tally.abstain.toString());

		const percentage = proposal.tally?.[val] ? tally(parseInt(proposal.tally?.[val].toString()), sum) : '0%';

		return rawNumber ? parseFloat(percentage.replace('%', '')) : percentage;
	} else {
		const sum =
			proposal.raw.final_tally_result &&
			proposal.raw.final_tally_result.yes &&
			proposal.raw.final_tally_result.no &&
			proposal.raw.final_tally_result.no_with_veto &&
			proposal.raw.final_tally_result.abstain &&
			parseInt(proposal.raw.final_tally_result.yes) +
				parseInt(proposal.raw.final_tally_result.no) +
				parseInt(proposal.raw.final_tally_result.no_with_veto) +
				parseInt(proposal.raw.final_tally_result.abstain);

		const percentage = proposal.raw?.final_tally_result?.[val]
			? tally(proposal.raw.final_tally_result[val], sum)
			: '0%';

		return rawNumber ? parseFloat(percentage.replace('%', '')) : percentage;
	}
};
