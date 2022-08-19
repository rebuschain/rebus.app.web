import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, DialogContent } from '@material-ui/core';
import './index.scss';
import variables from 'src/utils/variables';
import { hideDelegateFailedDialog } from 'src/actions/stake';
import failed from 'src/assets/stake/failed.svg';
import { config } from 'src/config-insync';

const UnSuccessDialog = props => {
	const handleRedirect = () => {
		const link = `${config.EXPLORER_URL}/${props.hash}`;
		window.open(link, '_blank');
	};

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog delegate_dialog result"
			open={props.open}
			onClose={props.handleClose}>
			<DialogContent className="content">
				<div className="heading">
					<img alt="failed" src={failed} />
					{<h1>{variables[props.lang]['transaction_failed']}</h1>}
					<p>{props.message}</p>
				</div>

				{props.hash && (
					<div className="row mt-9">
						<p>{variables[props.lang]['transaction_hash']}</p>
						<div className="hash_text link" title={props.hash} onClick={handleRedirect}>
							<p className="name">{props.hash}</p>
							{props.hash && props.hash.slice(props.hash.length - 6, props.hash.length)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

UnSuccessDialog.propTypes = {
	handleClose: PropTypes.func.isRequired,
	lang: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	hash: PropTypes.string,
};

UnSuccessDialog.defaultProps = {
	hash: '',
};

const stateToProps = state => {
	return {
		lang: state.language,
		open: state.stake.failedDialog.open,
		message: state.stake.failedDialog.message,
		hash: state.stake.failedDialog.hash,
	};
};

const actionToProps = {
	handleClose: hideDelegateFailedDialog,
};

export default connect(stateToProps, actionToProps)(UnSuccessDialog);
