import React, { FunctionComponent } from 'react';
import { Slide, SlideProps, Snackbar as MaterialSnackbar } from '@material-ui/core';
import icon from 'src/assets/userDetails/warning.svg';
import './index.scss';

const TransitionUp: FunctionComponent<SlideProps> = props => <Slide direction="up" {...props} />;

type SnackbarProps = {
	message: string;
	open: boolean;
	onClose: () => void;
};

const Snackbar: FunctionComponent<SnackbarProps> = props => {
	return (
		<MaterialSnackbar
			ContentProps={{
				'aria-describedby': 'message-id',
			}}
			TransitionComponent={TransitionUp}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			autoHideDuration={5000}
			className="snackbar"
			message={
				<span className="message" id="message-id">
					{props.message === 'Account not connected. Please connect to wallet' ? (
						<img alt="snackImage" src={icon} />
					) : null}
					{props.message}
				</span>
			}
			open={props.open}
			onClose={props.onClose}
		/>
	);
};

export default Snackbar;
