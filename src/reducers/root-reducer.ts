import { combineReducers } from 'redux';
import language from './slices/language';
import snackbar from './slices/snackbar';
import navBar from './slices/nav-bar';
import processingDialog from './slices/dialogs/slices/processing-dialog';
import failedDialog from './slices/dialogs/slices/failed-dialog';
import successDialog from './slices/dialogs/slices/success-dialog';

export default combineReducers({
	language,
	snackbar,
	processingDialog,
	failedDialog,
	successDialog,
	navBar,
});
