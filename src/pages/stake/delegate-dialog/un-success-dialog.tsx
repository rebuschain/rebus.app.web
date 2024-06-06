import React, { FunctionComponent } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import variables from 'src/utils/variables';
import { failedDialogActions } from 'src/reducers/slices';
import failed from 'src/assets/stake/failed.svg';
import { config } from 'src/config-insync';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { ResultDialogHeader, ResultDialogText } from './components';
import { useStore } from 'src/stores';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.stake.failedDialog.open,
		message: state.stake.failedDialog.message,
		hash: state.stake.failedDialog.hash,
	};
};

const UnSuccessDialog: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const { walletStore } = useStore();
	const [handleClose] = useActions([failedDialogActions.hideFailedDialog]);
	const { lang, open, message, hash } = useAppSelector(selector);

	const handleRedirect = () => {
		const link = `${walletStore.getExplorerUrl()}/${hash}`;
		window.open(link, '_blank');
	};

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog delegate_dialog result"
			open={open}
			onClose={() => handleClose()}>
			<DialogContent className="content">
				<div className="text-center">
					<div className="flex justify-center items-center mb-3">
						<img alt="failed" className="mr-2" src={failed} />
						<ResultDialogHeader>{variables[lang]['transaction_failed']}</ResultDialogHeader>
					</div>
					<ResultDialogText>{message}</ResultDialogText>
				</div>

				{hash && (
					<div className="flex justify-between mt-9 mb-4">
						<ResultDialogText className="mr-7.5">{variables[lang]['transaction_hash']}</ResultDialogText>
						<div className="w-36 cursor-pointer hover:underline overflow-hidden" title={hash} onClick={handleRedirect}>
							<ResultDialogText className="name overflow-ellipsis overflow-hidden">{hash}</ResultDialogText>
							{hash && hash.slice(hash.length - 6, hash.length)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default UnSuccessDialog;
