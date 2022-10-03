import React, { FunctionComponent } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import variables, { Lang } from 'src/utils/variables';
import { failedDialogActions } from 'src/reducers/slices';
import failed from 'src/assets/stake/failed.svg';
import { config } from 'src/config-insync';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import './index.scss';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.stake.failedDialog.open,
		message: state.stake.failedDialog.message,
		hash: state.stake.failedDialog.hash,
	};
};

const UnSuccessDialog: FunctionComponent = () => {
	const [handleClose] = useActions([failedDialogActions.hideFailedDialog]);
	const { lang, open, message, hash } = useAppSelector(selector);

	const handleRedirect = () => {
		const link = `${config.EXPLORER_URL}/${hash}`;
		window.open(link, '_blank');
	};

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog delegate_dialog result"
			open={open}
			onClose={handleClose}>
			<DialogContent className="content">
				<div className="heading">
					<img alt="failed" src={failed} />
					{<h1>{variables[lang]['transaction_failed']}</h1>}
					<p>{message}</p>
				</div>

				{hash && (
					<div className="row mt-9">
						<p>{variables[lang]['transaction_hash']}</p>
						<div className="hash_text link" title={hash} onClick={handleRedirect}>
							<p className="name">{hash}</p>
							{hash && hash.slice(hash.length - 6, hash.length)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default UnSuccessDialog;
