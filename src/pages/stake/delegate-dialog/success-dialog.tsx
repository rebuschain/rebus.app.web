import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import variables from 'src/utils/variables';
import { successDialogActions } from 'src/reducers/slices';
import success from 'src/assets/stake/success.svg';
import { config } from 'src/config-insync';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useAddress } from 'src/hooks/use-address';
import { ResultDialogHeader, ResultDialogText } from './components';
import { useStore } from 'src/stores';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		tokens: state.stake.successDialog.tokens,
		open: state.stake.successDialog.open,
		isNft: state.stake.successDialog.isNft,
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
	const [handleClose] = useActions([successDialogActions.hideSuccessDialog]);
	const {
		tokens,
		lang,
		open,
		hash,
		name,
		validator,
		toValidator,
		validatorList,
		claimValidator,
		proposalOpen,
		isNft,
	} = useAppSelector(selector);
	const address = useAddress();

	const handleRedirect = () => {
		const link = `${walletStore.getExplorerUrl()}/${hash}`;
		window.open(link, '_blank');
	};

	const validatorDetails =
		validatorList && validatorList.length && validatorList.find(val => val.operator_address === validator);
	const toValidatorDetails =
		validatorList && validatorList.length && validatorList.find(val => val.operator_address === toValidator);

	return (
		<Dialog
			aria-describedby="delegate-dialog-description"
			aria-labelledby="delegate-dialog-title"
			className="dialog delegate_dialog result"
			open={open}
			onClose={() => handleClose()}>
			<DialogContent className="content">
				<div className="flex items-center mb-7.5 justify-center">
					<img alt="success" className="mr-2" src={success} />
					{isNft ? (
						<ResultDialogHeader>{variables[lang].nft_id_created}</ResultDialogHeader>
					) : name ? (
						<ResultDialogHeader>{name + 'd Successfully'}</ResultDialogHeader>
					) : !proposalOpen && claimValidator && claimValidator !== 'none' ? (
						<ResultDialogHeader>{variables[lang].claimed_success}</ResultDialogHeader>
					) : proposalOpen ? (
						<ResultDialogHeader>{variables[lang].vote_success}</ResultDialogHeader>
					) : (
						<ResultDialogHeader>{variables[lang].success}</ResultDialogHeader>
					)}
				</div>
				{proposalOpen && hash ? (
					<div className="flex justify-between mb-4">
						<ResultDialogText>{variables[lang]['transaction_hash']}</ResultDialogText>
						<div className="hash_text cursor-pointer hover:underline" title={hash} onClick={handleRedirect}>
							<ResultDialogText className="name">{hash}</ResultDialogText>
							{hash && hash.slice(hash.length - 6, hash.length)}
						</div>
					</div>
				) : !name ? (
					claimValidator && claimValidator !== 'none' ? (
						<>
							<div className="flex justify-between mb-4">
								<ResultDialogText>{variables[lang]['transaction_hash']}</ResultDialogText>
								<div className="hash_text cursor-pointer hover:underline" title={hash} onClick={handleRedirect}>
									<ResultDialogText className="name">{hash}</ResultDialogText>
									{hash && hash.slice(hash.length - 6, hash.length)}
								</div>
							</div>
							{tokens?.trim() && (
								<div className="flex justify-between mb-4">
									<ResultDialogText>{variables[lang].tokens}</ResultDialogText>
									<ResultDialogText>{tokens + ' ' + config.COIN_DENOM}</ResultDialogText>
								</div>
							)}
						</>
					) : null
				) : (
					<>
						<div className="flex justify-between mb-4">
							<ResultDialogText>{variables[lang]['transaction_hash']}</ResultDialogText>
							<div className="hash_text cursor-pointer hover:underline" title={hash} onClick={handleRedirect}>
								<ResultDialogText className="name">{hash}</ResultDialogText>
								<ResultDialogText>{hash && hash.slice(hash.length - 6, hash.length)}</ResultDialogText>
							</div>
						</div>
						<div className="flex justify-between mb-4">
							<ResultDialogText>{variables[lang]['delegator_address']}</ResultDialogText>
							<div className="hash_text" title={address}>
								<ResultDialogText className="name">{address}</ResultDialogText>
								<ResultDialogText>{address && address.slice(address.length - 6, address.length)}</ResultDialogText>
							</div>
						</div>
						{name === 'Redelegate' ? (
							<>
								<div className="flex justify-between mb-4">
									<ResultDialogText>From {variables[lang]['validator_address']}</ResultDialogText>
									<div className="text-right">
										<div className="hash_text" title={validator}>
											<ResultDialogText className="name">{validator}</ResultDialogText>
											<ResultDialogText>
												{validator && validator.slice(validator.length - 6, validator.length)}
											</ResultDialogText>
										</div>
										<ResultDialogText>
											{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
												? `(${validatorDetails.description.moniker})`
												: null}
										</ResultDialogText>
									</div>
								</div>
								<div className="flex justify-between mb-4">
									<ResultDialogText>To {variables[lang]['validator_address']}</ResultDialogText>
									<div className="text-right">
										<div className="hash_text" title={toValidator}>
											<ResultDialogText className="name">{toValidator}</ResultDialogText>
											<ResultDialogText>
												{toValidator && toValidator.slice(toValidator.length - 6, toValidator.length)}
											</ResultDialogText>
										</div>
										<ResultDialogText>
											{toValidatorDetails && toValidatorDetails.description && toValidatorDetails.description.moniker
												? `(${toValidatorDetails.description.moniker})`
												: null}
										</ResultDialogText>
									</div>
								</div>
							</>
						) : (
							<div className="flex justify-between mb-4">
								<ResultDialogText>{variables[lang]['validator_address']}</ResultDialogText>
								<div className="text-right">
									<div className="hash_text" title={validator}>
										<ResultDialogText className="name">{validator}</ResultDialogText>
										<ResultDialogText>
											{validator && validator.slice(validator.length - 6, validator.length)}
										</ResultDialogText>
									</div>
									<ResultDialogText>
										{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
											? `(${validatorDetails.description.moniker})`
											: null}
									</ResultDialogText>
								</div>
							</div>
						)}
						{tokens?.trim() && (
							<div className="flex justify-between mb-4">
								<ResultDialogText>{variables[lang].tokens}</ResultDialogText>
								<ResultDialogText>{tokens + ' ' + config.COIN_DENOM}</ResultDialogText>
							</div>
						)}
					</>
				)}
			</DialogContent>
			<DialogActions className="footer">
				<Button variant="contained" onClick={() => handleClose()}>
					{variables[lang].done}
				</Button>
			</DialogActions>
		</Dialog>
	);
});

export default SuccessDialog;
