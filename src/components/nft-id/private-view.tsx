import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import env from '@beam-australia/react-env';
import { decrypt, encrypt, generateKey, IPFS } from 'rebus.nftid.js';
import { ColorPicker } from 'src/components/nft-id/color-picker';
import { Tooltip } from '@mui/material';
import { IdForm } from 'src/components/nft-id/id-form';
import { IdPreview } from 'src/components/nft-id/id-preview';
import { COLOR_OPTIONS, IPFS_TIMEOUT } from 'src/constants/nft-id';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useStore } from 'src/stores';
import { NftIdData, Theme } from 'src/types/nft-id';
import variables from 'src/utils/variables';
import {
	failedDialogActions,
	processingDialogActions,
	successDialogActions,
	snackbarActions,
} from 'src/reducers/slices';
import { BigLoader } from 'src/components/common/loader';
import { gas } from 'src/constants/default-gas-values';
import { config } from 'src/config-insync';
import { aminoSignTx } from 'src/utils/helper';
import { MsgMintNftId } from '../../proto/rebus/nftid/v1/tx_pb';
import { NftId } from '../../proto/rebus/nftid/v1/id_pb';
import { Button } from '../common/button';
import { getIpfsHttpsUrl, getIpfsId } from 'src/utils/ipfs';
import InputDialog from 'src/pages/stake/delegate-dialog/input-dialog';
import { ENCRYPTION_KEY_KEY } from 'src/stores/wallet';
import { StatusChangeButton } from './status-change-button';

const ipfs = new IPFS(env('NFT_STORAGE_TOKEN'));

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const PrivateView: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const { isEvmos } = account.rebus;

	const encryptionKeyKey = `${ENCRYPTION_KEY_KEY}_${address}`;

	const idQuery = queries.rebus.queryIdRecord.get(address);

	const { lang } = useAppSelector(selector);
	const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
	const [isFetchingPrivateImage, setIsFetchingPrivateImage] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [data, setData] = useState<NftIdData>({
		idNumber: '0x000000000000',
		documentNumber: '0',
	});
	const [currentIdImageData, setCurrentIdImageData] = useState('');
	const [currentPublicIdImageData, setCurrentPublicIdImageData] = useState('');
	const [currentPrivateIdImageData, setCurrentPrivateIdImageData] = useState('');
	const [isDecryptingPrivateImage, setIsDecryptingPrivateImage] = useState(false);
	const [isDecrypted, setIsDecrypted] = useState(false);

	const [publicImageData, setPublicImageData] = useState('');
	const [privateImageData, setPrivateImageData] = useState('');

	const [failedDialog, successDialog, pendingDialog, showMessage] = useActions([
		failedDialogActions.showFailedDialog,
		successDialogActions.showSuccessDialog,
		processingDialogActions.showProcessingDialog,
		snackbarActions.showSnackbar,
	]);

	// Double encryption key used to encrypt the encryption_key of the nft id
	const doubleEncryptionKey = useRef('');
	const publicViewTooltipRef = useRef(null);
	const decryptIdTooltipRef = useRef(null);
	const clearEncryptionTooltipRef = useRef(null);
	const [tempDoubleEncryptionKey, setTempDoubleEncryptionKey] = useState('');
	const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
	const [showMintInputDialog, setShowMintInputDialog] = useState(false);
	const closeInputDialog = useCallback(() => setIsInputDialogOpen(false), []);

	const { idRecord } = idQuery;
	const { document_number, encryption_key, id_number, metadata_url } = idRecord || {};

	const goToPublicPreviewLink = useCallback(() => {
		window.open(`${window.location.origin}/nft-id/${config.NFT_ID_ORG_NAME}/v1/${address}`, '_blank');
	}, [address]);

	const onChange = useCallback((name: any, value: any) => {
		setData(oldData => ({ ...oldData, [name]: value }));
	}, []);
	const onChangeColor = useCallback((color: Theme) => {
		setData(oldData => ({ ...oldData, theme: color }));
	}, []);
	const onVisibilityChange = useCallback((name: any, value: any) => {
		if (name === 'cityOfBirth') {
			name = 'placeOfBirth';
		}

		setData(oldData => ({ ...oldData, [`${name}Hidden`]: value }));
	}, []);

	const onSubmit = useCallback(
		async (shouldRegenerateDoubleEncryptionKey = false) => {
			if (!address) {
				showMessage(variables[lang]['connect_account']);
				return;
			}

			if (
				!walletStore.isLoaded &&
				encryption_key &&
				!doubleEncryptionKey.current &&
				!shouldRegenerateDoubleEncryptionKey
			) {
				setShowMintInputDialog(true);
				setIsInputDialogOpen(true);
				return;
			}

			if (!publicImageData || !privateImageData) {
				showMessage('Error generating NFT images, please add data');
				return;
			}

			setIsSaving(true);

			let currentDoubleEncryptionKey: string | undefined = undefined;
			let encryptionKey = '';
			let encryptedEncryptionKey = encryption_key;

			try {
				if (encryptedEncryptionKey) {
					if (walletStore.isLoaded) {
						encryptionKey = await walletStore.decrypt(encryptedEncryptionKey);
					} else {
						if (doubleEncryptionKey.current) {
							currentDoubleEncryptionKey = doubleEncryptionKey.current;
							encryptionKey = decrypt(currentDoubleEncryptionKey, encryptedEncryptionKey);
						} else {
							// Reset keys
							currentDoubleEncryptionKey = generateKey();
							encryptionKey = generateKey();
							encryptedEncryptionKey = encrypt(currentDoubleEncryptionKey || '', encryptionKey);
						}
					}
				} else {
					encryptionKey = generateKey();

					if (walletStore.isLoaded) {
						encryptedEncryptionKey = await walletStore.encrypt(encryptionKey);
					} else {
						// Keplr encryption currently generates a second encryption key which is kept only by the user in order to encrypt the encryption key
						currentDoubleEncryptionKey = generateKey();
						encryptedEncryptionKey = encrypt(currentDoubleEncryptionKey || '', encryptionKey);
					}
				}
			} catch (err) {
				console.error(err);
				doubleEncryptionKey.current = '';
				localStorage.removeItem(encryptionKeyKey);
				showMessage('Error encrypting/decrypting information for NFT ID');
				setIsSaving(false);
				return;
			}

			const { url } = await ipfs.createNft({
				type: NftId.V1,
				organization: config.NFT_ID_ORG_NAME,
				address,
				encryptionKey,
				imageExtension: 'png',
				imageType: 'image/png',
				publicImageData,
				privateImageData,
				extraProperties: { theme: data.theme },
			});

			const mintNftIdMessage = new MsgMintNftId();
			mintNftIdMessage.setAddress(address);
			mintNftIdMessage.setNftType(NftId.V1);
			mintNftIdMessage.setOrganization(config.NFT_ID_ORG_NAME);
			mintNftIdMessage.setEncryptionKey(encryptedEncryptionKey || '');
			mintNftIdMessage.setMetadataUrl(url);
			const objMessage = mintNftIdMessage.toObject();

			const msg = {
				address: objMessage.address,
				nft_type: objMessage.nftType,
				organization: objMessage.organization,
				encryption_key: objMessage.encryptionKey,
				metadata_url: objMessage.metadataUrl,
			};

			const tx = {
				msgs: [
					{
						typeUrl: '/rebus.nftid.v1.MsgMintNftId',
						value: objMessage,
					},
				],
				fee: {
					amount: [
						{
							amount: String(gas.mint_nftid * config.GAS_PRICE_STEP_AVERAGE),
							denom: config.COIN_MINIMAL_DENOM,
						},
					],
					gas: String(gas.mint_nftid),
				},
				memo: '',
			};
			const ethTx = {
				fee: {
					amount: String(gas.mint_nftid * config.GAS_PRICE_STEP_AVERAGE),
					denom: config.COIN_MINIMAL_DENOM,
					gas: String(gas.mint_nftid),
				},
				msg,
				memo: '',
			};

			let txCode = 0;
			let txHash = '';
			let txLog = '';

			try {
				if (walletStore.isLoaded) {
					const result = await walletStore.mintNftId(ethTx, tx as any);
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
				try {
					localStorage.setItem(
						encryptionKeyKey,
						encrypt(encryptedEncryptionKey || '', currentDoubleEncryptionKey || '')
					);
				} catch (err) {
					console.error(err);
					showMessage('Error saving encryption key in browser storage');
				}

				// Wait 2 seconds so the query can be able to fetch it, and also delete previous nft at the same time
				try {
					await Promise.all([
						new Promise(resolve => setTimeout(resolve, 2000)),
						ipfs.deleteIpfs(getIpfsId(metadata_url || '')),
					]);
				} catch (err) {
					// Error deleting nft id, ignore it
				}

				successDialog({
					// Only show encryption key if it's different
					doubleEncryptionKey:
						currentDoubleEncryptionKey !== doubleEncryptionKey.current ? currentDoubleEncryptionKey : '',
					hash: txHash,
					isNft: true,
				});
				showMessage(
					'NFT ID Successfuly created, but it might take a few seconds before you can see it once you refresh the page'
				);

				doubleEncryptionKey.current = currentDoubleEncryptionKey || '';
				queries.queryBalances.getQueryBech32Address(address).fetch();
				queries.rebus.queryIdRecord.get(address).fetch();
			} else {
				try {
					// Delete uploaded ipfs if there was an error creating the id
					ipfs.deleteIpfs(getIpfsId(url || ''));
				} catch (err) {
					// Error deleting nft id, ignore it
				}
			}

			setIsSaving(false);
		},
		[
			address,
			walletStore,
			encryption_key,
			publicImageData,
			privateImageData,
			data.theme,
			showMessage,
			lang,
			isEvmos,
			failedDialog,
			pendingDialog,
			successDialog,
			queries.queryBalances,
			queries.rebus.queryIdRecord,
			encryptionKeyKey,
			metadata_url,
		]
	);

	const encryptPrivateImage = useCallback(() => {
		setCurrentIdImageData(currentPublicIdImageData);
		setIsDecrypted(false);
	}, [currentPublicIdImageData]);

	const decryptPrivateImage = useCallback(async () => {
		if (!walletStore.isLoaded && !doubleEncryptionKey.current) {
			setShowMintInputDialog(false);
			setIsInputDialogOpen(true);
			return;
		}

		setIsDecryptingPrivateImage(true);

		try {
			const decryptedEncryptionKey = walletStore.isLoaded
				? await walletStore.decrypt(encryption_key || '')
				: decrypt(doubleEncryptionKey.current, encryption_key || '');
			const decryptedPrivateImage = decrypt(decryptedEncryptionKey, currentPrivateIdImageData);

			setCurrentIdImageData(decryptedPrivateImage);
			setIsDecrypted(true);
		} catch (err) {
			console.error(err);
			doubleEncryptionKey.current = '';
			localStorage.removeItem(encryptionKeyKey);
			showMessage(
				'Error decrypting private image' + (walletStore.isLoaded ? '' : '. Please try clearing the encryption key data')
			);
		}

		setIsDecryptingPrivateImage(false);
	}, [walletStore, encryption_key, currentPrivateIdImageData, encryptionKeyKey, showMessage]);

	const onSubmitDoubleEncryptionKey = useCallback(() => {
		setIsInputDialogOpen(false);
		setTempDoubleEncryptionKey('');
		doubleEncryptionKey.current = tempDoubleEncryptionKey;

		if (showMintInputDialog) {
			onSubmit(true);
		} else {
			if (encryption_key) {
				try {
					localStorage.setItem(encryptionKeyKey, encrypt(encryption_key, tempDoubleEncryptionKey));
				} catch (err) {
					console.error(err);
					showMessage('Error saving encryption key in browser storage');
				}
			}

			decryptPrivateImage();
		}
	}, [
		decryptPrivateImage,
		encryptionKeyKey,
		encryption_key,
		onSubmit,
		showMessage,
		showMintInputDialog,
		tempDoubleEncryptionKey,
	]);

	const clearEncryptionKey = useCallback(() => {
		localStorage.removeItem(encryptionKeyKey);
		doubleEncryptionKey.current = '';
		showMessage('Encryption key cleared from browser storage');
	}, [encryptionKeyKey, showMessage]);

	// Make html element not be scrollable otherwise there's 2 scroll bars in mobile view
	useEffect(() => {
		if (document?.body?.parentElement) {
			document.body.parentElement.style.overflow = 'hidden';
		}

		return () => {
			if (document?.body?.parentElement) {
				document.body.parentElement.style.overflow = '';
			}
		};
	}, []);

	// Set the double encryption key from local storage
	useEffect(() => {
		if (encryption_key) {
			const encryptedDoubleEncryptionKey = localStorage.getItem(encryptionKeyKey);

			if (encryptedDoubleEncryptionKey) {
				try {
					doubleEncryptionKey.current = decrypt(encryption_key, encryptedDoubleEncryptionKey);
				} catch (err) {
					console.error(err);
					// Don't alert the user since this happens on page load
				}
			}
		}
	}, [encryptionKeyKey, encryption_key]);

	useEffect(() => {
		if (id_number) {
			const documentNumberLength = document_number?.toString()?.length ?? 0;
			const documentNumberPrefix = 'REBUS'.slice(0, 6 + (6 - documentNumberLength));

			setData(oldData =>
				oldData.idNumber !== id_number || !oldData.documentNumber?.startsWith(document_number || '')
					? {
							...oldData,
							idNumber: id_number || '',
							documentNumber: document_number ? `${documentNumberPrefix}${document_number.padStart(6, '0')}` : '',
					  }
					: oldData
			);

			if (metadata_url) {
				setIsFetchingMetadata(true);

				(async () => {
					try {
						const { data: metadata } = await axios.get(getIpfsHttpsUrl(metadata_url), { timeout: IPFS_TIMEOUT });
						setData(oldData => ({
							...oldData,
							theme: metadata?.properties?.theme,
						}));
						setIsFetchingMetadata(false);

						setIsFetchingPrivateImage(true);
						const [{ data: privateImageData }, { data: publicImageData }] = await Promise.all([
							axios.get(getIpfsHttpsUrl(metadata?.properties?.private_image), {
								timeout: IPFS_TIMEOUT,
							}),
							axios.get(getIpfsHttpsUrl(metadata?.image), {
								timeout: IPFS_TIMEOUT,
							}),
						]);
						setCurrentPublicIdImageData(publicImageData);
						setCurrentPrivateIdImageData(privateImageData);

						if (!privateImageData || privateImageData.startsWith('data:image/png;base64,')) {
							setCurrentIdImageData(privateImageData || '');
						} else if (privateImageData) {
							setCurrentIdImageData(publicImageData);
						}
					} catch (error) {
						console.error(`Unable to fetch NFT ID metadata from ${metadata_url}`, error);
					}

					setIsFetchingMetadata(false);
					setIsFetchingPrivateImage(false);
				})();
			}
		}
	}, [document_number, encryption_key, id_number, metadata_url, walletStore]);

	if (idQuery.isFetching || isFetchingMetadata) {
		return <BigLoader />;
	}

	return (
		<div>
			<div className="flex-col-reverse w-full h-full flex md:flex-row">
				<IdForm
					className="w-full md:w-fit md:mr-20"
					buttonText="Save"
					data={data}
					isLoading={isSaving}
					isSubmitDisabled={!privateImageData}
					onChange={onChange}
					onSubmit={onSubmit}
					onVisibilityChange={onVisibilityChange}
					shouldConfirm={!!id_number}
				/>
				<div>
					{id_number && metadata_url && (
						<IdPreview
							className="mb-6"
							data={data}
							idImageDataString={currentIdImageData}
							isFetchingImage={isFetchingPrivateImage}
							subtitleContent={<StatusChangeButton className="mb-4" />}
							title="Current ID"
							titleClassName="mr-3"
							titleSuffix={
								<div className="whitespace-nowrap">
									<Tooltip title="Open public view of NFT ID in another tab" arrow>
										<Button
											ref={publicViewTooltipRef}
											backgroundStyle="blue"
											onClick={goToPublicPreviewLink}
											smallBorderRadius>
											See Public View
										</Button>
									</Tooltip>

									<Tooltip
										title={
											isDecrypted
												? 'Decrypts the private view of the NFT ID below revealing private fields if there are any'
												: 'Encrypts the private view of the NFT ID below hiding private fields if there are any'
										}
										arrow>
										<Button
											ref={decryptIdTooltipRef}
											backgroundStyle="blue"
											disabled={isDecryptingPrivateImage || isSaving || isFetchingPrivateImage}
											onClick={isDecrypted ? encryptPrivateImage : decryptPrivateImage}
											smallBorderRadius
											style={{ marginLeft: '8px' }}>
											{isDecrypted ? 'Encrypt ID' : 'Decrypt ID'}
										</Button>
									</Tooltip>

									{/* Keplr only */}
									{!walletStore.isLoaded && address && !!localStorage.getItem(encryptionKeyKey) && (
										<Tooltip
											title="Removes the encryption key used to decrypt the NFT ID private view from the browser storage"
											arrow>
											<Button
												ref={clearEncryptionTooltipRef}
												backgroundStyle="blue"
												disabled={isSaving}
												onClick={clearEncryptionKey}
												smallBorderRadius
												style={{ marginLeft: '8px' }}>
												Clear Encryption Key
											</Button>
										</Tooltip>
									)}
								</div>
							}
						/>
					)}
					<IdPreview
						className="mb-10 md:mb-0"
						data={data}
						onRenderPrivateImage={setPrivateImageData}
						onRenderPublicImage={setPublicImageData}
						title="New ID (Public Preview)"
					/>
					<ColorPicker
						className="mt-6"
						onChange={onChangeColor}
						options={COLOR_OPTIONS}
						value={data.theme || COLOR_OPTIONS[0]}
					/>
				</div>
			</div>

			<InputDialog
				content={
					showMintInputDialog
						? 'Please enter your encryption key to mint your NFT ID (Leave blank to generate a new one)'
						: 'Please enter your encryption key to decrypt your NFT ID'
				}
				isDisabled={!showMintInputDialog && !tempDoubleEncryptionKey}
				isOpen={isInputDialogOpen}
				onChange={setTempDoubleEncryptionKey}
				onClose={closeInputDialog}
				onSubmit={onSubmitDoubleEncryptionKey}
				submitText="Confirm"
				title="Confirm Encryption Key"
				value={tempDoubleEncryptionKey}
			/>
		</div>
	);
});

export { PrivateView };
