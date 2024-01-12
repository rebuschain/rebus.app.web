import React, { FunctionComponent } from 'react';
import variables from 'src/utils/variables';
import { processingDialogActions } from 'src/reducers/slices';
import processing from 'src/assets/stake/processing.svg';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import Modal from 'src/components/common/modal';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		open: state.processingDialog,
	};
};

const PendingDialog: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const [handleClose] = useActions([processingDialogActions.hideProcessingDialog]);
	const { lang, open } = useAppSelector(selector);

	return (
		<Modal
			open={open}
			onClose={() => handleClose()}
			title=""
			subtitle=""
			hasSubmitButton={false}
			hasCancelButton={false}
			hasExitButton={false}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<img alt="processing" className="w-24 mr-2" src={processing} />
				<h6 style={{ margin: '10px', marginTop: '20px' }}>{variables[lang]['transaction_processing']}</h6>
			</div>
		</Modal>
	);
};

export default PendingDialog;
