import { IBCCurrencyRegsitrar, QueriesStore } from '@keplr-wallet/stores';
import { AccountStore } from '@keplr-wallet/stores';
import { DenomHelper, IndexedDBKVStore, LocalKVStore } from '@keplr-wallet/common';
import { ChainInfoWithExplorer, ChainStore } from './chain';
import { AppCurrency, ChainInfo, Keplr } from '@keplr-wallet/types';
import { EmbedChainInfos, IBCAssetInfos } from '../config';
import { QueriesWithCosmosAndRebus } from './rebus/query';
import { AccountWithCosmosAndRebus } from './rebus/account';
import { LayoutStore } from './layout';
import { GammSwapManager } from './rebus/swap';
import { LPCurrencyRegistrar } from './rebus/currency-registrar';
import { ChainInfoInner } from '@keplr-wallet/stores';
import { PoolIntermediatePriceStore } from './price';
import { IBCTransferHistoryStore } from './ibc-history';
import { WalletStore } from './wallet';
import { displayToast, TToastType } from '../components/common/toasts';
import { isSlippageError } from '../utils/tx';
import { prettifyTxError } from 'src/stores/prettify-tx-error';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import { ConnectWalletManager } from 'src/dialogs/connect-wallet';

export class RootStore {
	public readonly chainStore: ChainStore;
	public readonly accountStore: AccountStore<AccountWithCosmosAndRebus>;
	public readonly queriesStore: QueriesStore<QueriesWithCosmosAndRebus>;
	public readonly priceStore: PoolIntermediatePriceStore;
	public readonly walletStore: WalletStore;

	public readonly ibcTransferHistoryStore: IBCTransferHistoryStore;

	public readonly swapManager: GammSwapManager;
	public readonly connectWalletManager: ConnectWalletManager;

	protected readonly lpCurrencyRegistrar: LPCurrencyRegistrar<ChainInfoWithExplorer>;
	protected readonly ibcCurrencyRegistrar: IBCCurrencyRegsitrar<ChainInfoWithExplorer>;

	public readonly layoutStore: LayoutStore;

	constructor() {
		this.chainStore = new ChainStore(EmbedChainInfos, EmbedChainInfos[0].chainId, EmbedChainInfos[1].chainId);
		this.connectWalletManager = new ConnectWalletManager(this.chainStore);

		this.queriesStore = new QueriesStore(
			new IndexedDBKVStore('store_web_queries'),
			this.chainStore,
			this.connectWalletManager.getKeplr,
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
					getKeplr: this.connectWalletManager.getKeplr,
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

						if (this.accountStore.getAccount(chainInfo.chainId).rebus.isEvmos) {
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.bip44.coinType = 60;
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.coinType = 60;
							copied.currencies.push({
								coinDenom: 'LUDUS',
								coinMinimalDenom: 'uludus',
								coinDecimals: 6,
								coinGeckoId: 'ludus',
							});
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							copied.features = ['eth-address-gen', 'eth-key-sign'];
						}

						await keplr.experimentalSuggestChain(copied);
					},
				},
				chainOpts: this.chainStore.chainInfos.map(chainInfo => {
					return {
						chainId: chainInfo.chainId,
						msgOpts: { ibcTransfer: { gas: 130000 } },
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

		this.priceStore = new PoolIntermediatePriceStore(
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
			'usd',
			this.queriesStore.get(EmbedChainInfos[0].chainId).rebus.queryGammPools,
			[]
		);

		this.ibcTransferHistoryStore = new IBCTransferHistoryStore(
			new IndexedDBKVStore('ibc_transfer_history'),
			this.chainStore
		);

		this.walletStore = new WalletStore();
		this.connectWalletManager.setWalletStore(this.walletStore);

		// TODO: Add pools
		this.swapManager = new GammSwapManager([
			{
				poolId: '1',
				currencies: [
					{
						coinMinimalDenom: 'areba',
						coinDenom: 'REBUS',
						coinDecimals: 18,
					},
					{
						coinMinimalDenom: 'uosmo',
						coinDenom: 'OSMO',
						coinDecimals: 6,
					},
				],
			},
		]);

		this.lpCurrencyRegistrar = new LPCurrencyRegistrar(this.chainStore);
		this.ibcCurrencyRegistrar = new IBCCurrencyRegsitrar<ChainInfoWithExplorer>(
			new LocalKVStore('store_ibc_currency_registrar'),
			3 * 24 * 3600 * 1000, // 3 days
			this.chainStore,
			this.accountStore,
			this.queriesStore,
			this.queriesStore,
			(
				denomTrace: {
					denom: string;
					paths: {
						portId: string;
						channelId: string;
					}[];
				},
				originChainInfo: ChainInfoInner | undefined,
				counterpartyChainInfo: ChainInfoInner | undefined,
				originCurrency: AppCurrency | undefined
			) => {
				const firstPath = denomTrace.paths[0];

				// If the IBC Currency's channel is known,
				// Don't show the channel info on the coin denom.
				const knownAssetInfo = IBCAssetInfos.filter(info => info.sourceChannelId === firstPath.channelId).find(
					info => info.coinMinimalDenom === denomTrace.denom
				);
				if (knownAssetInfo) {
					return originCurrency ? originCurrency.coinDenom : denomTrace.denom;
				}

				return `${originCurrency ? originCurrency.coinDenom : denomTrace.denom} (${
					denomTrace.paths.length > 0 ? denomTrace.paths[0].channelId : 'Unknown'
				})`;
			}
		);

		this.layoutStore = new LayoutStore();
	}

	setIsEvmos = (chainId: string, isEvmos: boolean) => {
		this.accountStore.getAccount(chainId).rebus.isEvmos = isEvmos;
	};
}

export function createRootStore() {
	return new RootStore();
}
