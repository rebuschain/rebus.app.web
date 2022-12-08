import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { Slide, SlideProps, Snackbar as MaterialSnackbar } from '@mui/material';
import icon from 'src/assets/user-details/warning.svg';

const TransitionUp: FunctionComponent<SlideProps> = props => <Slide direction="up" {...props} />;

type SnackbarProps = {
	message: string;
	open: boolean;
	onClose: () => void;
};

const Snackbar: FunctionComponent<SnackbarProps> = props => {
	return (
		<MaterialSnackbarStyled
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
				<span className="flex items-center" id="message-id">
					{props.message === 'Account not connected. Please connect to wallet' ? (
						<img alt="snackImage" className="w-8 mr-2.5" src={icon} />
					) : null}
					{props.message}
				</span>
			}
			open={props.open}
			onClose={props.onClose}
		/>
	);
};

const MaterialSnackbarStyled = styled(MaterialSnackbar)`
	left: 10px;
	transform: translatex(10px);

	& > div {
		background: #282525;
	}
`;

export default Snackbar;
