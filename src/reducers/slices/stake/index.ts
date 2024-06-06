import { combineReducers } from 'redux';
import {
	claimDialog,
	delegateDialog,
	delegatedValidators,
	failedDialog,
	processingDialog,
	search,
	successDialog,
	validatorDetails,
	validators,
} from './slices';

export * from './slices';
export default combineReducers({
	search,
	delegateDialog,
	successDialog,
	processingDialog,
	failedDialog,
	validators,
	validatorDetails,
	delegatedValidators,
	claimDialog,
});
