import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { useStore } from 'src/stores';
import {
	failedDialogActions,
	processingDialogActions,
	successDialogActions,
	snackbarActions,
} from 'src/reducers/slices';
import env from '@beam-australia/react-env';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import variables from 'src/utils/variables';
import { RootState } from 'src/reducers/store';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/default-gas-values';
import { aminoSignTx } from 'src/utils/helper';
import ConfirmDialog from 'src/pages/stake/delegate-dialog/confirm-dialog';
import { Button } from '../common/button';
import { NftId } from '../../proto/rebus/nftid/v1/id_pb';
import { MsgActivateNftId, MsgDeactivateNftId } from '../../proto/rebus/nftid/v1/tx_pb';

type StatusChangeButtonProps = {
	className?: string;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const activationCost = parseFloat((Number(env('NFT_ID_ACTIVATION_LOCK_FEE')) / 10 ** config.COIN_DECIMALS).toFixed(1));

export const StatusChangeButton = observer<StatusChangeButtonProps>(({ className }) => {
	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const { isEvmos } = account.rebus;

	const idQuery = queries.rebus.queryIdRecord.get(address);
	const { active, metadata_url } = idQuery.idRecord || {};

	const { lang } = useAppSelector(selector);
	const [failedDialog, successDialog, pendingDialog, showMessage] = useActions([
		failedDialogActions.showFailedDialog,
		successDialogActions.showSuccessDialog,
		processingDialogActions.showProcessingDialog,
		snackbarActions.showSnackbar,
	]);

	const [iSubmitting, setIsSubmitting] = useState(false);

	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const openConfirmDialog = useCallback(() => setIsConfirmDialogOpen(true), []);
	const closeConfirmDialog = useCallback(() => setIsConfirmDialogOpen(false), []);

	const onActivate = useCallback(async () => {
		if (!address) {
			showMessage(variables[lang]['connect_account']);
			return;
		}

		setIsSubmitting(true);
		closeConfirmDialog();

		const activateNftIdMessage = new MsgActivateNftId();
		activateNftIdMessage.setAddress(address);
		activateNftIdMessage.setNftType(NftId.V1);
		activateNftIdMessage.setOrganization(config.NFT_ID_ORG_NAME);
		activateNftIdMessage.setTimestamp(Date.now().toString());
		const objMessage = activateNftIdMessage.toObject();

		const msg = {
			address: objMessage.address,
			nft_type: objMessage.nftType,
			organization: objMessage.organization,
			timestamp: objMessage.timestamp,
		};

		const tx = {
			msgs: [
				{
					typeUrl: '/rebus.nftid.v1.MsgActivateNftId',
					value: objMessage,
				},
			],
			fee: {
				amount: [
					{
						amount: String(gas.activate_nftid * config.GAS_PRICE_STEP_AVERAGE),
						denom: config.COIN_MINIMAL_DENOM,
					},
				],
				gas: String(gas.activate_nftid),
			},
			memo: '',
		};
		const ethTx = {
			fee: {
				amount: String(gas.activate_nftid * config.GAS_PRICE_STEP_AVERAGE),
				denom: config.COIN_MINIMAL_DENOM,
				gas: String(gas.activate_nftid),
			},
			msg,
			memo: '',
		};

		let txCode = 0;
		let txHash = '';
		let txLog = '';

		try {
			if (walletStore.isLoaded) {
				const result = await walletStore.activateNftId(ethTx, tx as any);
				txCode = result?.tx_response?.code || 0;
				txHash = result?.tx_response?.txhash || '';
				txLog = result?.tx_response?.raw_log || '';
			} else {
				const result = await aminoSignTx(tx, address, null, isEvmos);
				txCode = result?.code || 0;
				txHash = result?.transactionHash || '';
				txLog = result?.rawLog || '';
			}

			if (txCode) {
				throw new Error(txLog);
			}
		} catch (err) {
			const message = (err as any)?.message || '';

			if (message.indexOf('not yet found on the chain') > -1) {
				pendingDialog();
				return;
			}

			failedDialog({ message });
			showMessage(message);
		}

		if (txHash && !txCode) {
			successDialog({
				hash: txHash,
				isNftIdActivated: true,
			});
			showMessage('NFT ID successfuly activated');

			queries.queryBalances.getQueryBech32Address(address).fetch();
			queries.rebus.queryIdRecord.get(address).fetch();
		}

		setIsSubmitting(false);
	}, [
		address,
		closeConfirmDialog,
		failedDialog,
		isEvmos,
		lang,
		pendingDialog,
		queries.queryBalances,
		queries.rebus.queryIdRecord,
		showMessage,
		successDialog,
		walletStore,
	]);

	const onDeactivate = useCallback(async () => {
		if (!address) {
			showMessage(variables[lang]['connect_account']);
			return;
		}

		setIsSubmitting(true);
		closeConfirmDialog();

		const deactivateNftIdMessage = new MsgDeactivateNftId();
		deactivateNftIdMessage.setAddress(address);
		deactivateNftIdMessage.setNftType(NftId.V1);
		deactivateNftIdMessage.setOrganization(config.NFT_ID_ORG_NAME);
		const objMessage = deactivateNftIdMessage.toObject();

		const msg = {
			address: objMessage.address,
			nft_type: objMessage.nftType,
			organization: objMessage.organization,
		};

		const tx = {
			msgs: [
				{
					typeUrl: '/rebus.nftid.v1.MsgDeactivateNftId',
					value: objMessage,
				},
			],
			fee: {
				amount: [
					{
						amount: String(gas.activate_nftid * config.GAS_PRICE_STEP_AVERAGE),
						denom: config.COIN_MINIMAL_DENOM,
					},
				],
				gas: String(gas.activate_nftid),
			},
			memo: '',
		};
		const ethTx = {
			fee: {
				amount: String(gas.activate_nftid * config.GAS_PRICE_STEP_AVERAGE),
				denom: config.COIN_MINIMAL_DENOM,
				gas: String(gas.activate_nftid),
			},
			msg,
			memo: '',
		};

		let txCode = 0;
		let txHash = '';
		let txLog = '';

		try {
			if (walletStore.isLoaded) {
				const result = await walletStore.deactivateNftId(ethTx, tx as any);
				txCode = result?.tx_response?.code || 0;
				txHash = result?.tx_response?.txhash || '';
				txLog = result?.tx_response?.raw_log || '';
			} else {
				const result = await aminoSignTx(tx, address, null, isEvmos);
				txCode = result?.code || 0;
				txHash = result?.transactionHash || '';
				txLog = result?.rawLog || '';
			}

			if (txCode) {
				throw new Error(txLog);
			}
		} catch (err) {
			const message = (err as any)?.message || '';

			if (message.indexOf('not yet found on the chain') > -1) {
				pendingDialog();
				return;
			}

			failedDialog({ message });
			showMessage(message);
		}

		if (txHash && !txCode) {
			successDialog({
				hash: txHash,
				isNftIdActivated: false,
			});
			showMessage('NFT ID successfuly deactivated');

			queries.queryBalances.getQueryBech32Address(address).fetch();
			queries.rebus.queryIdRecord.get(address).fetch();
		}

		setIsSubmitting(false);
	}, [
		address,
		closeConfirmDialog,
		failedDialog,
		isEvmos,
		lang,
		pendingDialog,
		queries.queryBalances,
		queries.rebus.queryIdRecord,
		showMessage,
		successDialog,
		walletStore,
	]);

	if (!address || !metadata_url) {
		return null;
	}

	return (
		<div className={className}>
			<h6 className="whitespace-nowrap">
				Status: <span className={active ? 'text-green' : 'text-red'}>{active ? 'Active' : 'Not Active'}</span>
			</h6>
			<Button
				backgroundStyle="secondary"
				disabled={iSubmitting}
				onClick={openConfirmDialog}
				style={{ marginTop: '8px' }}>
				{active ? 'Deactivate' : 'Activate'}
			</Button>

			<ConfirmDialog
				content={
					active
						? 'Are you sure you want to deactivate the NFT ID and refund the locked tokens?'
						: `To activate the NFT ID, it will be necessary locking ${activationCost} REBUS tokens, are you sure you want to proceed?`
				}
				isOpen={isConfirmDialogOpen}
				onClose={closeConfirmDialog}
				onConfirm={active ? onDeactivate : onActivate}
				title={active ? 'Confirm Deactivation of NFT ID' : 'Confirm Activation of NFT ID'}
			/>
		</div>
	);
});
