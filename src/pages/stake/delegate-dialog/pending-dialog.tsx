import React, { FunctionComponent } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import variables from 'src/utils/variables';
import { processingDialogActions } from 'src/reducers/slices';
import processing from 'src/assets/stake/processing.svg';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { ResultDialogHeader } from './components';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.stake.processingDialog,
	};
};

const PendingDialog: FunctionComponent = () => {
	const [handleClose] = useActions([processingDialogActions.hideProcessingDialog]);
	const { lang, open } = useAppSelector(selector);

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog delegate_dialog result pending"
			open={open}
			onClose={handleClose}>
			<DialogContent className="content">
				<div className="text-center flex items-center justify-center">
					<img alt="processing" className="w-24 mr-2" src={processing} />
					{<ResultDialogHeader>{variables[lang]['transaction_processing']}</ResultDialogHeader>}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default PendingDialog;
