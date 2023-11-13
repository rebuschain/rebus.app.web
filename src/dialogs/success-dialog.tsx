import React from 'react';
import { observer } from 'mobx-react-lite';
import variables from 'src/utils/variables';
import { successDialogActions, snackbarActions } from 'src/reducers/slices';
import success from 'src/assets/stake/success.svg';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { copyTextToClipboard } from 'src/utils/copy-to-clipboard';
import Modal from 'src/components/common/modal';
import { Button } from 'src/components/common/button';
import styled from 'styled-components';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		tokens: state.successDialog.tokens,
		doubleEncryptionKey: state.successDialog.doubleEncryptionKey,
		open: state.successDialog.open,
		isNft: state.successDialog.isNft,
		isNftIdRecord: state.successDialog.isNftIdRecord,
		isNftIdActivated: state.successDialog.isNftIdActivated,
		hash: state.successDialog.hash,
	};
};

const SuccessDialog = observer(() => {
	const [handleClose, showMessage] = useActions([successDialogActions.hideSuccessDialog, snackbarActions.showSnackbar]);
	const { lang, open, doubleEncryptionKey, isNft, isNftIdRecord, isNftIdActivated } = useAppSelector(selector);

	const copyEncryptionKey = () => {
		copyTextToClipboard(doubleEncryptionKey, () => showMessage('Copied encryption key to clipboard!'));
	};

	return (
		<Modal
			open={open}
			onClose={() => handleClose()}
			submitText={variables[lang].done}
			hasCancelButton={false}
			onConfirm={() => handleClose()}>
			<DivStyled style={{ flexDirection: 'row' }}>
				<img alt="success" className="mr-2" src={success} />
				{isNftIdActivated === true ? (
					<h6>{variables[lang].nft_id_activated}</h6>
				) : isNftIdActivated === false ? (
					<h6>{variables[lang].nft_id_deactivated}</h6>
				) : isNftIdRecord ? (
					<h6>{variables[lang].id_record_created}</h6>
				) : isNft ? (
					<h6>{variables[lang].nft_id_created}</h6>
				) : (
					<h6>{variables[lang].success}</h6>
				)}
			</DivStyled>
			{doubleEncryptionKey && (
				<DivStyled className="mb-4" style={{ flexDirection: 'column' }}>
					<p style={{ textAlign: 'center' }}>
						Please click the button below to copy the encryption key and save it in a safe place. You will need it if
						you access a different browser or clear your browser data.
					</p>
					<div className="mt-2">
						<Button backgroundStyle="secondary" onClick={copyEncryptionKey}>
							Copy
						</Button>
					</div>
				</DivStyled>
			)}
		</Modal>
	);
});

const DivStyled = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 20px;
`;

export default SuccessDialog;
