import { combineReducers } from 'redux';
import { dialog, items, proposalDetails, tallyDetails, voteDetails, votes } from './slices';

export * from './slices';
export default combineReducers({
	dialog,
	items,
	votes,
	voteDetails,
	tallyDetails,
	proposalDetails,
});
