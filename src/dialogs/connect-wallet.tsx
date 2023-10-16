import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import QRCode from 'qrcode.react';
import {
	isAndroid as checkIsAndroid,
	isMobile as checkIsMobile,
	saveMobileLinkInfo,
} from '@walletconnect/browser-utils';

import env from '@beam-australia/react-env';
import { observer } from 'mobx-react-lite';
import { action, makeObservable, observable } from 'mobx';
import { Keplr } from '@keplr-wallet/types';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import { BroadcastMode, StdTx } from '@cosmjs/launchpad';
import { EmbedChainInfos } from 'src/config';
import Axios from 'axios';
import { Buffer } from 'buffer/';
import { wrapBaseDialog } from './base';
import { AccountStore, getKeplrFromWindow, WalletStatus } from '@keplr-wallet/stores';
import { ChainStore } from 'src/stores/chain';
import { AccountWithCosmosAndRebus } from 'src/stores/rebus/account';
import { useStore } from 'src/stores';
import { IJsonRpcRequest } from '@walletconnect/types';
import { WalletStore } from 'src/stores/wallet';
import { WALLET_LIST } from 'src/constants/wallet';
import { useActions } from 'src/hooks/use-actions';
import { actions } from 'src/reducers/slices/snackbar';
import { config } from 'src/config-insync';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import { Button } from 'src/components/common/button';
import styled, { useTheme } from 'styled-components';

async function sendTx(chainId: string, tx: StdTx | Uint8Array, mode: BroadcastMode): Promise<Uint8Array> {
	const restInstance = Axios.create({
		baseURL: EmbedChainInfos.find(chainInfo => chainInfo.chainId === chainId)!.rest,
	});

	const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;

	const params = isProtoTx
		? {
				tx_bytes: Buffer.from(tx as any).toString('base64'),
				mode: (() => {
					switch (mode) {
						case 'async':
							return 'BROADCAST_MODE_ASYNC';
						case 'block':
							return 'BROADCAST_MODE_BLOCK';
						case 'sync':
							return 'BROADCAST_MODE_SYNC';
						default:
							return 'BROADCAST_MODE_UNSPECIFIED';
					}
				})(),
		  }
		: {
				tx,
				mode: mode,
		  };

	const result = await restInstance.post(isProtoTx ? '/cosmos/tx/v1beta1/txs' : '/txs', params);

	const txResponse = isProtoTx ? result.data['tx_response'] : result.data;

	if (txResponse.code != null && txResponse.code !== 0) {
		throw new Error(txResponse['raw_log']);
	}

	return Buffer.from(txResponse.txhash, 'hex');
}

class WalletConnectQRCodeModalV1Renderer {
	constructor() {}

	open(uri: string, cb: any) {
		const wrapper = document.createElement('div');
		wrapper.setAttribute('id', 'wallet-connect-qrcode-modal-v1');
		document.body.appendChild(wrapper);

		ReactDOM.render(
			<WalletConnectQRCodeModal
				uri={uri}
				close={() => {
					this.close();
					cb();
				}}
			/>,
			wrapper
		);
	}

	close() {
		const wrapper = document.getElementById('wallet-connect-qrcode-modal-v1');
		if (wrapper) {
			document.body.removeChild(wrapper);
		}
	}
}

export type WalletType = 'true' | 'extension' | 'wallet-connect' | 'metamask' | null;
export const KeyConnectingWalletType = 'connecting_wallet_type';
export const KeyConnectingWalletName = 'connecting_wallet_name';
export const KeyAutoConnectingWalletType = 'account_auto_connect';

export class ConnectWalletManager {
	// We should set the wallet connector when the `getKeplr()` method should return the `Keplr` for wallet connect.
	// But, account store request the `getKeplr()` method whenever that needs the `Keplr` api.
	// Thus, we should return the `Keplr` api persistently if the wallet connect is connected.
	// And, when the wallet is disconnected, we should clear this field.
	// In fact, `WalletConnect` itself is persistent.
	// But, in some cases, it acts inproperly.
	// So, handle that in the store logic too.
	protected walletConnector: WalletConnect | undefined;

	@observable
	autoConnectingWalletType: WalletType;
	connectingWalletName: string;

	constructor(
		protected readonly chainStore: ChainStore,
		protected accountStore?: AccountStore<AccountWithCosmosAndRebus>,
		protected walletStore?: WalletStore
	) {
		this.autoConnectingWalletType = localStorage?.getItem(KeyAutoConnectingWalletType) as WalletType;
		this.connectingWalletName = localStorage?.getItem(KeyConnectingWalletName) as string;
		makeObservable(this);
	}

	// The account store needs to reference the `getKeplr()` method this on the constructor.
	// But, this store also needs to reference the account store.
	// To solve this problem, just set the account store field lazily.
	setAccountStore(accountStore: AccountStore<AccountWithCosmosAndRebus>) {
		this.accountStore = accountStore;
	}

	setWalletStore(walletStore: WalletStore) {
		this.walletStore = walletStore;
	}

	setWalletName(name = '') {
		this.connectingWalletName = name;
	}

	protected onBeforeSendRequest = (request: Partial<IJsonRpcRequest>): void => {
		if (!checkIsMobile()) {
			return;
		}

		const deepLink = checkIsAndroid()
			? 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;'
			: 'keplrwallet://wcV1';

		switch (request.method) {
			case 'keplr_enable_wallet_connect_v1':
				// Keplr mobile requests another per-chain permission for each wallet connect session.
				// By the current logic, `enable()` is requested immediately after wallet connect is connected.
				// However, in this case, two requests are made consecutively.
				// So in ios, the deep link modal pops up twice and confuses the user.
				// To solve this problem, enable on the rebus chain does not open deep links.
				if (request.params && request.params.length === 1 && request.params[0] === this.chainStore.current.chainId) {
					break;
				}
				window.location.href = deepLink;
				break;
			case 'keplr_sign_amino_wallet_connect_v1':
				window.location.href = deepLink;
				break;
		}

		return;
	};

	getKeplr = (autoConnect = true): Promise<Keplr | undefined> => {
		const connectingWalletType =
			localStorage?.getItem(KeyAutoConnectingWalletType) || localStorage?.getItem(KeyConnectingWalletType);
		const connectingWalletName = localStorage?.getItem(KeyConnectingWalletName);

		if (connectingWalletType === 'wallet-connect') {
			if (!this.walletConnector) {
				this.walletConnector = new WalletConnect({
					bridge: 'https://bridge.walletconnect.org',
					signingMethods: [],
					qrcodeModal: new WalletConnectQRCodeModalV1Renderer(),
				});
				// XXX: I don't know why they designed that the client meta options in the constructor should be always ingored...
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				this.walletConnector._clientMeta = {
					name: 'Rebus',
					description: 'Rebus',
					url: env('REBUS_URL'),
					icons: [window.location.origin + '/public/assets/main/rebus-single.svg'],
				};

				this.walletConnector!.on('disconnect', this.onWalletConnectDisconnected);
			}

			if (!this.walletConnector.connected) {
				return new Promise<Keplr | undefined>((resolve, reject) => {
					this.walletConnector!.connect()
						.then(() => {
							if (autoConnect) {
								localStorage?.removeItem(KeyConnectingWalletType);
								localStorage?.setItem(KeyAutoConnectingWalletType, 'wallet-connect');
								this.autoConnectingWalletType = 'wallet-connect';
							}

							resolve(
								new KeplrWalletConnectV1(this.walletConnector!, {
									sendTx,
									onBeforeSendRequest: this.onBeforeSendRequest,
								})
							);
						})
						.catch(e => {
							console.log(e);
							// XXX: Due to the limitation of cureent account store implementation.
							//      We shouldn't throw an error (reject) on the `getKeplr()` method.
							//      So return the `undefined` temporarily.
							//      In this case, the wallet will be considered as `NotExist`
							resolve(undefined);
						});
				});
			} else {
				if (autoConnect) {
					localStorage?.removeItem(KeyConnectingWalletType);
					localStorage?.setItem(KeyAutoConnectingWalletType, 'wallet-connect');
					this.autoConnectingWalletType = 'wallet-connect';
				}

				return Promise.resolve(
					new KeplrWalletConnectV1(this.walletConnector, {
						sendTx,
						onBeforeSendRequest: this.onBeforeSendRequest,
					})
				);
			}
		} else if (
			(!connectingWalletName || connectingWalletName.includes('keplr')) &&
			(this.accountStore?.getAccount(config.CHAIN_ID).walletStatus === WalletStatus.Loaded ||
				this.accountStore?.getAccount(config.CHAIN_ID).walletStatus === WalletStatus.Loading)
		) {
			if (autoConnect) {
				localStorage?.removeItem(KeyConnectingWalletType);
				localStorage?.setItem(KeyAutoConnectingWalletType, 'extension');
				this.autoConnectingWalletType = 'extension';
			}
		}

		return getKeplrFromWindow();
	};

	onWalletConnectDisconnected = (error: Error | null) => {
		if (error) {
			console.log(error);
		} else {
			this.disableAutoConnect();
			this.disconnect();
		}
	};

	/**
	 * Disconnect the wallet regardless of wallet type (extension, wallet connect)
	 */
	disconnect() {
		if (this.walletConnector) {
			if (this.walletConnector.connected) {
				this.walletConnector.killSession();
			}
			this.walletConnector = undefined;
		}

		if (this.accountStore) {
			const account = this.accountStore.getAccount(this.chainStore.chainInfos[0].chainId);

			if (account.walletStatus !== WalletStatus.NotInit) {
				account.disconnect();
			}
		}

		if (this.walletStore) {
			this.walletStore.disconnect();
		}
	}

	@action
	disableAutoConnect() {
		localStorage?.removeItem(KeyAutoConnectingWalletType);
		this.autoConnectingWalletType = null;
	}
}

export const ConnectWalletDialog = wrapBaseDialog(
	observer(({ initialFocus, close }: { initialFocus: React.RefObject<HTMLDivElement>; close: () => void }) => {
		const { connectWalletManager, chainStore, accountStore, walletStore, setIsEvmos } = useStore();
		const [isMobile] = useState(() => checkIsMobile());
		const { isAccountConnected } = useAccountConnection();
		const [showSnackbar] = useActions([actions.showSnackbar]);
		const account = accountStore.getAccount(chainStore.current.chainId);
		const theme = useTheme();

		useEffect(() => {
			// Skip the selection of wallet type if mobile
			const wallet = WALLET_LIST.find(({ type }) => type === 'wallet-connect');

			if (isMobile && wallet) {
				localStorage.setItem(KeyConnectingWalletType, wallet.type);
				localStorage.removeItem(KeyConnectingWalletName);
				connectWalletManager.setWalletName('');
				setIsEvmos(chainStore.current.chainId, false);
				account.init();
				close();
			}
		}, [account, accountStore, chainStore, close, connectWalletManager, isMobile, setIsEvmos]);

		if (!WALLET_LIST.length) {
			return (
				<div ref={initialFocus}>
					<h4 className="text-lg md:text-xl">Connect Wallet</h4>
					<p className="text-xs md:text-sm mt-4">
						This browser does not support any wallet extensions, please use either Chrome or Firefox.
					</p>
				</div>
			);
		}

		return (
			<div ref={initialFocus}>
				<h4 className="text-lg md:text-xl">Connect Wallet</h4>
				{WALLET_LIST.filter(wallet => {
					if (isMobile && wallet.type == 'extension') {
						return false;
					}
					return true;
				}).map(wallet => (
					<Button
						key={wallet.name}
						backgroundStyle="secondary"
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							height: 'auto',
							marginBottom: '10px',
							marginTop: '10px',
						}}
						onClick={async () => {
							const isConnectingKeplr = wallet.walletType?.includes('keplr');

							localStorage.setItem(KeyConnectingWalletType, wallet.type);
							localStorage.setItem(KeyConnectingWalletName, wallet.walletType || '');
							connectWalletManager.setWalletName(wallet.walletType || '');

							if (!isConnectingKeplr) {
								try {
									const success = await walletStore.init(wallet.walletType, true);
									localStorage.setItem(KeyAutoConnectingWalletType, success ? 'extension' : '');
								} catch (err) {
									showSnackbar((err as any)?.message || err);
								}
							} else {
								setIsEvmos(chainStore.current.chainId, wallet.walletType === 'keplr-evmos');
								account.init();
							}
							close();
						}}>
						<img
							src={wallet.logoUrl}
							className="w-12 mr-3 md:w-16 md:mr-5"
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
							}}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								textAlign: 'left',
								color: theme.text,
							}}>
							<h5 className="text-base md:text-lg mb-1">{wallet.name}</h5>
							<p className="text-xs md:text-sm">{wallet.description}</p>
						</div>
					</Button>
				))}
			</div>
		);
	})
);

export const WalletConnectQRCodeModal: FunctionComponent<React.PropsWithChildren<{
	uri: string;
	close: () => void;
}>> = ({ uri, close }) => {
	const [isMobile] = useState(() => checkIsMobile());
	const [isAndroid] = useState(() => checkIsAndroid());

	const navigateToAppURL = useMemo(() => {
		if (isMobile) {
			if (isAndroid) {
				// Save the mobile link.
				saveMobileLinkInfo({
					name: 'Keplr',
					href: 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
				});

				return `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
			} else {
				// Save the mobile link.
				saveMobileLinkInfo({
					name: 'Keplr',
					href: 'keplrwallet://wcV1',
				});

				return `keplrwallet://wcV1?${uri}`;
			}
		}
	}, [isMobile, isAndroid, uri]);

	useEffect(() => {
		if (navigateToAppURL) {
			window.location.href = navigateToAppURL;
		}
	}, [navigateToAppURL]);

	const [isTimeout, setIsTimeout] = useState(false);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setIsTimeout(true);
		}, 2000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	// Perhaps there is no way to know whether the app is installed or launched in the web browser.
	// For now, if users are still looking at the screen after 2 seconds, assume that the app isn't installed.
	if (isMobile) {
		if (isTimeout) {
			return (
				<div className="fixed inset-0 z-100 overflow-y-auto">
					<div className="p-5 flex items-center justify-center min-h-screen">
						<div
							className="fixed inset-0 bg-black opacity-20 flex justify-center items-center"
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();

								close();
							}}
						/>
						<div
							className="relative md:max-w-modal px-4 py-5 md:p-8 bg-surface shadow-elevation-24dp rounded-2xl z-10"
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();
							}}>
							{isAndroid ? (
								<button
									className="px-6 py-2.5 rounded-xl bg-primary-400 flex items-center justify-center mx-auto hover:opacity-75"
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();

										window.location.href = navigateToAppURL!;
									}}>
									<h6 className="text-white-high">Open Keplr</h6>
								</button>
							) : (
								<button
									className="px-6 py-2.5 rounded-xl bg-primary-400 flex items-center justify-center mx-auto hover:opacity-75"
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();

										window.location.href = 'itms-apps://itunes.apple.com/app/1567851089';
									}}>
									<h6 className="text-white-high">Install Keplr</h6>
								</button>
							)}
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="fixed inset-0 z-100 overflow-y-auto">
					<div className="p-5 flex items-center justify-center min-h-screen">
						<div
							className="fixed inset-0 bg-black opacity-20 flex justify-center items-center"
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();

								close();
							}}
						/>
						<div
							className="relative md:max-w-modal px-4 py-5 md:p-8 bg-surface shadow-elevation-24dp rounded-2xl z-10"
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();
							}}>
							<img alt="ldg" className="s-spin w-7 h-7" src="/public/assets/icons/loading.png" />
						</div>
					</div>
				</div>
			);
		}
	}

	return (
		<div className="fixed inset-0 z-100 overflow-y-auto">
			<div className="p-5 flex items-center justify-center min-h-screen">
				<div
					className="fixed inset-0 bg-black opacity-20 flex justify-center items-center"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();

						close();
					}}
				/>

				<div
					className="relative md:max-w-modal px-4 py-5 md:p-8 bg-surface shadow-elevation-24dp rounded-2xl z-10"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<h4 className="text-lg md:text-xl mb-3 md:mb-5 text-white-high">Scan QR Code</h4>
					<div className="p-3.5 bg-white-high">
						<QRCode size={500} value={uri} />
					</div>

					<img
						onClick={() => close()}
						className="absolute cursor-pointer top-3 md:top-5 right-3 md:right-5 w-8 md:w-10"
						src="/public/assets/icons/close.svg"
					/>
				</div>
			</div>
		</div>
	);
};
