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
import './index.scss';

const selector = (state: RootState) => {
	return {
		lang: state.language,
		tokens: state.stake.successDialog.tokens,
		open: state.stake.successDialog.open,
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
	} = useAppSelector(selector);
	const address = useAddress();

	const handleRedirect = () => {
		const link = `${config.EXPLORER_URL}/${hash}`;
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
			onClose={handleClose}>
			<DialogContent className="content">
				<div className="heading">
					<img alt="success" src={success} />
					{name ? (
						<h1>{name + 'd Successfully'}</h1>
					) : claimValidator && claimValidator !== 'none' ? (
						<h1>{variables[lang].claimed_success}</h1>
					) : proposalOpen ? (
						<h1>{variables[lang].vote_success}</h1>
					) : (
						<h1>{variables[lang].success}</h1>
					)}
				</div>
				{proposalOpen && hash ? (
					<div className="row">
						<p>{variables[lang]['transaction_hash']}</p>
						<div className="hash_text link" title={hash} onClick={handleRedirect}>
							<p className="name">{hash}</p>
							{hash && hash.slice(hash.length - 6, hash.length)}
						</div>
					</div>
				) : !name ? (
					claimValidator && claimValidator !== 'none' ? (
						<>
							<div className="row">
								<p>{variables[lang]['transaction_hash']}</p>
								<div className="hash_text link" title={hash} onClick={handleRedirect}>
									<p className="name">{hash}</p>
									{hash && hash.slice(hash.length - 6, hash.length)}
								</div>
							</div>
							<div className="row">
								<p>{variables[lang].tokens}</p>
								<p>{tokens ? Number(tokens).toFixed(4) + ' ' + config.COIN_DENOM : null}</p>
							</div>
						</>
					) : null
				) : (
					<>
						<div className="row">
							<p>{variables[lang]['transaction_hash']}</p>
							<div className="hash_text link" title={hash} onClick={handleRedirect}>
								<p className="name">{hash}</p>
								{hash && hash.slice(hash.length - 6, hash.length)}
							</div>
						</div>
						<div className="row">
							<p>{variables[lang]['delegator_address']}</p>
							<div className="hash_text" title={address}>
								<p className="name">{address}</p>
								{address && address.slice(address.length - 6, address.length)}
							</div>
						</div>
						{name === 'Redelegate' ? (
							<>
								<div className="row">
									<p>From {variables[lang]['validator_address']}</p>
									<div className="validator">
										<div className="hash_text" title={validator}>
											<p className="name">{validator}</p>
											{validator && validator.slice(validator.length - 6, validator.length)}
										</div>
										<p>
											{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
												? `(${validatorDetails.description.moniker})`
												: null}
										</p>
									</div>
								</div>
								<div className="row">
									<p>To {variables[lang]['validator_address']}</p>
									<div className="validator">
										<div className="hash_text" title={toValidator}>
											<p className="name">{toValidator}</p>
											{toValidator && toValidator.slice(toValidator.length - 6, toValidator.length)}
										</div>
										<p>
											{toValidatorDetails && toValidatorDetails.description && toValidatorDetails.description.moniker
												? `(${toValidatorDetails.description.moniker})`
												: null}
										</p>
									</div>
								</div>
							</>
						) : (
							<div className="row">
								<p>{variables[lang]['validator_address']}</p>
								<div className="validator">
									<div className="hash_text" title={validator}>
										<p className="name">{validator}</p>
										{validator && validator.slice(validator.length - 6, validator.length)}
									</div>
									<p>
										{validatorDetails && validatorDetails.description && validatorDetails.description.moniker
											? `(${validatorDetails.description.moniker})`
											: null}
									</p>
								</div>
							</div>
						)}
						<div className="row">
							<p>{variables[lang].tokens}</p>
							<p>{tokens ? Number(tokens).toFixed(4) + ' ' + config.COIN_DENOM : null}</p>
						</div>
					</>
				)}
			</DialogContent>
			<DialogActions className="footer">
				<Button variant="contained" onClick={handleClose}>
					{variables[lang].done}
				</Button>
			</DialogActions>
		</Dialog>
	);
});

export default SuccessDialog;
