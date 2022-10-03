import React, { FunctionComponent, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Snackbar from 'src/components/insync/Snackbar';
import { useActions } from 'src/hooks/useActions';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { actions } from 'src/reducers/slices/snackbar';

const SnackbarMessage: FunctionComponent<RouteComponentProps<any>> = ({ history }) => {
	const { open, message } = useAppSelector(state => state.snackbar);
	const [hideSnackbar] = useActions([actions.hideSnackbar]);

	useEffect(() => {
		switch (message) {
			case 'Token is expired':
			case 'Error occurred while verifying the JWT token.':
			case 'User Id and token combination does not exist.':
				hideSnackbar();

				localStorage.removeItem('of_co_address');
				history.push('/');

				break;
			default:
				break;
		}
	}, [hideSnackbar, history, message]);

	return <Snackbar message={message} open={open} onClose={hideSnackbar} />;
};

export default withRouter(SnackbarMessage);
