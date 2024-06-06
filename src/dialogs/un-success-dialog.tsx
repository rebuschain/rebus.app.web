import React, { FunctionComponent } from 'react';
import variables from 'src/utils/variables';
import { failedDialogActions } from 'src/reducers/slices';
import failed from 'src/assets/stake/failed.svg';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useStore } from 'src/stores';
import Modal from 'src/components/common/modal';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.failedDialog.open,
		message: state.failedDialog.message,
		hash: state.failedDialog.hash,
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
		<Modal open={open} onClose={() => handleClose()} hasSubmitButton={false} hasCancelButton={false}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingBottom: '25px' }}>
				<img alt="failed" className="mr-2" src={failed} />
				<h6 style={{ marginTop: '5px' }}>{variables[lang]['transaction_failed']}</h6>
			</div>
			<h6 style={{ display: 'flex', justifyContent: 'center' }}>{message}</h6>
			{hash && (
				<div>
					<h6>{variables[lang]['transaction_hash']}</h6>
					<div title={hash} onClick={handleRedirect}>
						<h6>{hash}</h6>
						{hash && hash.slice(hash.length - 6, hash.length)}
					</div>
				</div>
			)}
		</Modal>
	);
};

export default UnSuccessDialog;
