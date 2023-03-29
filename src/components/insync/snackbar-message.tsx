import React, { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from 'src/components/insync/snackbar';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { actions } from 'src/reducers/slices/snackbar';

const SnackbarMessage: FunctionComponent<React.PropsWithChildren<any>> = () => {
	const navigate = useNavigate();
	const { open, message } = useAppSelector(state => state.snackbar);
	const [hideSnackbar] = useActions([actions.hideSnackbar]);

	useEffect(() => {
		switch (message) {
			case 'Token is expired':
			case 'Error occurred while verifying the JWT token.':
			case 'User Id and token combination does not exist.':
				hideSnackbar();

				localStorage.removeItem('of_co_address');
				navigate('/');

				break;
			default:
				break;
		}
	}, [hideSnackbar, navigate, message]);

	return <Snackbar message={message} open={open} onClose={hideSnackbar} />;
};

export default SnackbarMessage;
