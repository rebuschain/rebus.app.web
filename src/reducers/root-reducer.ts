import { combineReducers } from 'redux';
import language from './slices/language';
import snackbar from './slices/snackbar';
import stake from './slices/stake';
import proposals from './slices/proposals';
import navBar from './slices/nav-bar';

export default combineReducers({
	language,
	snackbar,
	stake,
	proposals,
	navBar,
});
