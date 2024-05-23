import { QueriesStore } from '@keplr-wallet/stores';
import { AccountStore } from '@keplr-wallet/stores';
import { IndexedDBKVStore } from '@keplr-wallet/common';
import { ChainStore } from './chain';
import { ChainInfo } from '@keplr-wallet/types';
import { EmbedChainInfos } from '../config';
import { QueriesWithCosmosAndRebus } from './rebus/query';
import { AccountWithCosmosAndRebus } from './rebus/account';
import { LayoutStore } from './layout';
import { IntermediatePriceStore } from './price';
import { IBCTransferHistoryStore } from './ibc-history';
import { WalletStore } from './wallet';
import { displayToast, TToastType } from '../components/common/toasts';
import { isSlippageError } from '../utils/tx';
import { prettifyTxError } from 'src/stores/prettify-tx-error';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import { ConnectWalletManager, KeyConnectingWalletName } from 'src/dialogs/connect-wallet';
import { gas } from 'src/constants/default-gas-values';
import { KEPLR_EVMOS_VERSION, KEPLR_VERSION, WALLET_LIST } from 'src/constants/wallet';
import { FeatureFlagStore } from './feature-flags';
import { QuestionsStore } from './questions';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

export class RootStore {
	public readonly featureFlagStore: FeatureFlagStore;
	public readonly questionsStore: QuestionsStore;

	public readonly chainStore: ChainStore;
	public readonly accountStore: AccountStore<AccountWithCosmosAndRebus>;
	public readonly queriesStore: QueriesStore<QueriesWithCosmosAndRebus>;
	public readonly priceStore: IntermediatePriceStore;
	public readonly walletStore: WalletStore;

	public readonly ibcTransferHistoryStore: IBCTransferHistoryStore;

	public readonly connectWalletManager: ConnectWalletManager;

	public readonly layoutStore: LayoutStore;

	constructor(autoConnect = true) {
		this.featureFlagStore = new FeatureFlagStore(new IndexedDBKVStore('store_feature_flags'));
		this.questionsStore = new QuestionsStore(new IndexedDBKVStore('store_questions'));

		this.chainStore = new ChainStore(EmbedChainInfos, EmbedChainInfos[0].chainId, EmbedChainInfos[1].chainId);
		this.connectWalletManager = new ConnectWalletManager(this.chainStore);

		this.queriesStore = new QueriesStore(
			new IndexedDBKVStore('store_web_queries'),
			this.chainStore,
			() => this.connectWalletManager.getKeplr(autoConnect),
			QueriesWithCosmosAndRebus
		);

		this.accountStore = new AccountStore<AccountWithCosmosAndRebus>(
			window,
			AccountWithCosmosAndRebus,
			this.chainStore,
			this.queriesStore,
			{
				defaultOpts: {
					prefetching: false,
					suggestChain: true,
					autoInit: false,
					getKeplr: () => this.connectWalletManager.getKeplr(autoConnect),
					suggestChainFn: async (keplr, chainInfo) => {
						if (keplr.mode === 'mobile-web') {
							// Can't suggest the chain on mobile web.
							return;
						}

						if (keplr instanceof KeplrWalletConnectV1) {
							// Can't suggest the chain using wallet connect.
							return;
						}

						// Fetching the price from the pool's spot price is slightly hacky.
						// It is set on the custom coin gecko id start with "pool:"
						// and custom price store calculates the spot price from the pool
						// and calculates the actual price with multiplying the known price from the coingecko of the other currency.
						// But, this logic is not supported on the Keplr extension,
						// so, delivering this custom coingecko id doesn't work on the Keplr extension.
						const copied = JSON.parse(JSON.stringify(chainInfo.raw)) as ChainInfo;
						if (copied.stakeCurrency.coinGeckoId?.startsWith('pool:')) {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							delete copied.stakeCurrency.coinGeckoId;
						}
						for (const currency of copied.currencies) {
							if (currency.coinGeckoId?.startsWith('pool:')) {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								delete currency.coinGeckoId;
							}
						}
						for (const currency of copied.feeCurrencies) {
							if (currency.coinGeckoId?.startsWith('pool:')) {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								delete currency.coinGeckoId;
							}
						}

						const account = this.accountStore.getAccount(chainInfo.chainId);

						if (account.rebus.isEvmos) {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.bip44.coinType = 60;
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.coinType = 60;
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.features = [...(copied.features || []), 'eth-address-gen', 'eth-key-sign'];
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.chainName += ' (EVM)';
						}

						if (account.rebus.version) {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.chainName += ` v${account.rebus.version}`;
						}

						await keplr.experimentalSuggestChain(copied);
					},
				},
				chainOpts: this.chainStore.chainInfos.map(chainInfo => {
					return {
						chainId: chainInfo.chainId,
						msgOpts: { ibcTransfer: { gas: gas.ibc_transfer } },
						preTxEvents: {
							onBroadcastFailed: (e?: Error) => {
								let message: string = 'Unknown error';
								if (e instanceof Error) {
									message = e.message;
								} else if (typeof e === 'string') {
									message = e;
								}

								try {
									message = prettifyTxError(message, chainInfo.currencies);
								} catch (e) {
									console.log(e);
								}

								displayToast(TToastType.TX_FAILED, {
									message,
								});
							},
							onBroadcasted: (txHash: Uint8Array) => {
								displayToast(TToastType.TX_BROADCASTING);
							},
							onFulfill: (tx: any) => {
								if (tx.code) {
									let message: string = tx.log;

									if (isSlippageError(tx)) {
										message = 'Swap failed. Liquidity may not be sufficient. Try adjusting the allowed slippage.';
									} else {
										try {
											message = prettifyTxError(message, chainInfo.currencies);
										} catch (e) {
											console.log(e);
										}
									}

									displayToast(TToastType.TX_FAILED, { message });
								} else {
									displayToast(TToastType.TX_SUCCESSFUL, {
										customLink: chainInfo.raw.explorerUrlToTx.replace('{txHash}', tx.hash.toUpperCase()),
									});
								}
							},
						},
					};
				}),
			}
		);
		this.connectWalletManager.setAccountStore(this.accountStore);

		this.priceStore = new IntermediatePriceStore(
			EmbedChainInfos[0].chainId,
			this.chainStore,
			new IndexedDBKVStore('store_web_prices'),
			{
				usd: {
					currency: 'usd',
					symbol: '$',
					maxDecimals: 2,
					locale: 'en-US',
				},
			},
			'usd'
		);

		this.ibcTransferHistoryStore = new IBCTransferHistoryStore(
			new IndexedDBKVStore('ibc_transfer_history'),
			this.chainStore
		);

		this.walletStore = new WalletStore();
		this.connectWalletManager.setWalletStore(this.walletStore);

		this.layoutStore = new LayoutStore();
	}

	setIsEvmos = async (chainId: string, isEvmos: boolean, showMessage: ActionCreatorWithPayload<string, string>) => {
		if (this.connectWalletManager.connectingWalletName?.includes('keplr')) {
			// Set this before trying to fetch the chain info so we can suggest the right chain if it is not suggested yet
			this._setIsEvmos(chainId, isEvmos);

			try {
				// Call this to initialize keplr
				this.connectWalletManager.getKeplr(false);
				// Access window keplr just to make sure we have access to the function getChainInfosWithoutEndpoints
				const keplr = window.keplr;

				const chainInfos = await (keplr as any).getChainInfosWithoutEndpoints();

				const chainInfo = chainInfos.find((chainInfo: any) => chainInfo.chainId === chainId);

				if (chainInfo) {
					const actualIsEvmos = chainInfo.chainName.toLowerCase().includes('evm');
					this._setIsEvmos(chainId, actualIsEvmos);

					if (actualIsEvmos !== isEvmos) {
						// Tell the user they tried to connect to an invalid network
						if (isEvmos) {
							const keplrWallet = WALLET_LIST.find(x => x.walletType === 'keplr');
							if (keplrWallet) {
								localStorage.setItem(KeyConnectingWalletName, keplrWallet.walletType || '');
							}

							showMessage(
								'You are connected to the regular Keplr network, please remove the network in the Keplr wallet to connect to EVM'
							);
						} else {
							const keplrWallet = WALLET_LIST.find(x => x.walletType === 'keplr-evmos');
							if (keplrWallet) {
								localStorage.setItem(KeyConnectingWalletName, keplrWallet.walletType || '');
							}

							showMessage(
								'You are connected to the EVM Keplr network, please remove the network in the Keplr wallet to connect to the regular network'
							);
						}
					}
				} else {
					console.warn('Not able to find the connected keplr network');
					this._setIsEvmos(chainId, isEvmos);
				}
			} catch (err) {
				console.error(`Error getting networks from keplr: ${err}`);
				this._setIsEvmos(chainId, isEvmos);
			}

			return;
		}

		this._setIsEvmos(chainId, isEvmos);
	};

	_setIsEvmos = (chainId: string, isEvmos: boolean) => {
		this.accountStore.getAccount(chainId).rebus.isEvmos = isEvmos;
		this.updateVersion(chainId);
	};

	updateVersion = (chainId: string) => {
		const account = this.accountStore.getAccount(chainId);

		if (account.rebus.isEvmos) {
			account.rebus.version = KEPLR_EVMOS_VERSION;
		} else {
			account.rebus.version = KEPLR_VERSION;
		}
	};
}

export function createRootStore(autoConnect = true) {
	return new RootStore(autoConnect);
}
