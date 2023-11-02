import React from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import variables from 'src/utils/variables';
import { successDialogActions, snackbarActions } from 'src/reducers/slices';
import success from 'src/assets/stake/success.svg';
import { config } from 'src/config-insync';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useAddress } from 'src/hooks/use-address';
import { ResultDialogHeader, ResultDialogText } from '../pages/stake/delegate-dialog/components';
import { Button as CommonButton } from 'src/components/common/button';
import { copyTextToClipboard } from 'src/utils/copy-to-clipboard';
import { useStore } from 'src/stores';
import Modal from 'src/components/common/modal';
import { Button } from 'src/components/common/button';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		tokens: state.stake.successDialog.tokens,
		doubleEncryptionKey: state.stake.successDialog.doubleEncryptionKey,
		open: state.stake.successDialog.open,
		isNft: state.stake.successDialog.isNft,
		isNftIdRecord: state.stake.successDialog.isNftIdRecord,
		isNftIdActivated: state.stake.successDialog.isNftIdActivated,
		hash: state.stake.successDialog.hash,
		name: state.stake.delegateDialog.name,
		validator: state.stake.delegateDialog.validatorAddress,
		toValidator: state.stake.delegateDialog.toValidatorAddress,
		validatorList: state.stake.validators.list,
		claimValidator: state.stake.claimDialog.validator,
		proposalOpen: state.proposals.dialog.open,
	};
};

const SuccessDialog = observer(() => {
	const { walletStore } = useStore();
	const [handleClose, showMessage] = useActions([successDialogActions.hideSuccessDialog, snackbarActions.showSnackbar]);
	const {
		tokens,
		lang,
		open,
		doubleEncryptionKey,
		hash,
		name,
		validator,
		toValidator,
		validatorList,
		claimValidator,
		proposalOpen,
		isNft,
		isNftIdRecord,
		isNftIdActivated,
	} = useAppSelector(selector);
	const address = useAddress();

	const handleRedirect = () => {
		const link = `${walletStore.getExplorerUrl()}/${hash}`;
		window.open(link, '_blank');
	};

	const copyEncryptionKey = () => {
		copyTextToClipboard(doubleEncryptionKey, () => showMessage('Copied encryption key to clipboard!'));
	};

	const validatorDetails =
		validatorList && validatorList.length && validatorList.find(val => val.operator_address === validator);
	const toValidatorDetails =
		validatorList && validatorList.length && validatorList.find(val => val.operator_address === toValidator);

	return (
		<Modal
			open={open}
			onClose={() => handleClose()}
			submitText={variables[lang].done}
			hasCancelButton={false}
			onConfirm={() => handleClose()}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingBottom: '20px' }}>
				<img alt="success" className="mr-2" src={success} />
				{isNftIdActivated === true ? (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].nft_id_activated}</h6>
				) : isNftIdActivated === false ? (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].nft_id_deactivated}</h6>
				) : isNftIdRecord ? (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].id_record_created}</h6>
				) : isNft ? (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].nft_id_created}</h6>
				) : name ? (
					<h6 style={{ marginTop: '5px' }}>{name + 'd Successfully'}</h6>
				) : !proposalOpen && claimValidator && claimValidator !== 'none' ? (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].claimed_success}</h6>
				) : proposalOpen ? (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].vote_success}</h6>
				) : (
					<h6 style={{ marginTop: '5px' }}>{variables[lang].success}</h6>
				)}
			</div>
			{doubleEncryptionKey && (
				<div className="mb-4">
					<h6>
						Please click the button below to copy the encryption key and save it in a safe place. You will need it if
						you access a different browser or clear your browser data.
					</h6>
					<div className="mt-2">
						<Button backgroundStyle="secondary" onClick={copyEncryptionKey}>
							Copy
						</Button>
					</div>
				</div>
			)}
			{proposalOpen && hash ? (
				<div className="flex justify-between mb-4">
					<h6>{variables[lang]['transaction_hash']}</h6>
					<div className="hash_text cursor-pointer hover:underline" title={hash} onClick={handleRedirect}>
						<h6 className="name">{hash}</h6>
						{hash && hash.slice(hash.length - 6, hash.length)}
					</div>
				</div>
			) : !name ? (
				claimValidator && claimValidator !== 'none' ? (
					<>
						<div className="flex justify-between mb-4">
							<h6>{variables[lang]['transaction_hash']}</h6>
							<div className="hash_text cursor-pointer hover:underline" title={hash} onClick={handleRedirect}>
								<h6 className="name">{hash}</h6>
								{hash && hash.slice(hash.length - 6, hash.length)}
							</div>
						</div>
						{tokens?.trim() && (
							<div className="flex justify-between mb-4">
								<h6>{variables[lang].tokens}</h6>
								<h6>{tokens + ' ' + config.COIN_DENOM}</h6>
							</div>
						)}
					</>
				) : null
			) : (
				<>
					<div className="flex justify-between mb-4">
						<h6>{variables[lang]['transaction_hash']}</h6>
						<div className="hash_text cursor-pointer hover:underline" title={hash} onClick={handleRedirect}>
							<h6 className="name">{hash}</h6>
							<h6>{hash && hash.slice(hash.length - 6, hash.length)}</h6>
						</div>
					</div>
					<div className="flex justify-between mb-4">
						<h6>{variables[lang]['delegator_address']}</h6>
						<div className="hash_text" title={address}>
							<h6 className="name">{address}</h6>
							<h6>{address && address.slice(address.length - 6, address.length)}</h6>
						</div>
					</div>
					{name === 'Redelegate' ? (
						<>
							<div className="flex justify-between mb-4">
								<h6>From {variables[lang]['validator_address']}</h6>
								<div className="text-right">
									<div className="hash_text" title={validator}>
										<h6 className="name">{validator}</h6>
										<h6>{validator && validator.slice(validator.length - 6, validator.length)}</h6>
									</div>
									<h6>
										{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
											? `(${validatorDetails.description.moniker})`
											: null}
									</h6>
								</div>
							</div>
							<div className="flex justify-between mb-4">
								<h6>To {variables[lang]['validator_address']}</h6>
								<div className="text-right">
									<div className="hash_text" title={toValidator}>
										<h6 className="name">{toValidator}</h6>
										<h6>{toValidator && toValidator.slice(toValidator.length - 6, toValidator.length)}</h6>
									</div>
									<h6>
										{toValidatorDetails && toValidatorDetails.description && toValidatorDetails.description.moniker
											? `(${toValidatorDetails.description.moniker})`
											: null}
									</h6>
								</div>
							</div>
						</>
					) : (
						<div className="flex justify-between mb-4">
							<h6>{variables[lang]['validator_address']}</h6>
							<div className="text-right">
								<div className="hash_text" title={validator}>
									<h6 className="name">{validator}</h6>
									<h6>{validator && validator.slice(validator.length - 6, validator.length)}</h6>
								</div>
								<h6>
									{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
										? `(${validatorDetails.description.moniker})`
										: null}
								</h6>
							</div>
						</div>
					)}
					{tokens?.trim() && (
						<div className="flex justify-between mb-4">
							<h6>{variables[lang].tokens}</h6>
							<h6>{tokens + ' ' + config.COIN_DENOM}</h6>
						</div>
					)}
				</>
			)}
		</Modal>
	);
});

export default SuccessDialog;
