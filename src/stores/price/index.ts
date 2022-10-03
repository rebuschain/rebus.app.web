import { ChainGetter, CoinGeckoPriceStore } from '@keplr-wallet/stores';
import { KVStore } from '@keplr-wallet/common';
import { FiatCurrency } from '@keplr-wallet/types';
import { makeObservable } from 'mobx';
import { CoinPretty, Dec } from '@keplr-wallet/unit';

export interface IntermidiateRoute {
	readonly alternativeCoinId: string;
	readonly poolId: string;
	readonly spotPriceSourceDenom: string;
	readonly spotPriceDestDenom: string;
	readonly destCoinId: string;
}

/**
 * IntermediatePriceStore permits the some currencies that are not listed on the coingecko
 * to use the spot price of the pool as the intermediate.
 */
export class IntermediatePriceStore extends CoinGeckoPriceStore {
	constructor(
		protected readonly osmosisChainId: string,
		protected readonly chainGetter: ChainGetter,
		kvStore: KVStore,
		supportedVsCurrencies: {
			[vsCurrency: string]: FiatCurrency;
		},
		defaultVsCurrency: string
	) {
		super(kvStore, supportedVsCurrencies, defaultVsCurrency);

		makeObservable(this);
	}

	getPrice(coinId: string, vsCurrency: string): number | undefined {
		try {
			return super.getPrice(coinId, vsCurrency);
		} catch (e) {
			console.log(`Failed to calculate price of (${coinId}, ${vsCurrency}): ${(<any>e)?.message}`);
			return undefined;
		}
	}

	getPricePretty(coin: CoinPretty, vsCurrency?: string, decimals = 2): string {
		const coinId = coin.currency.coinGeckoId;
		const currency = vsCurrency ? vsCurrency : this.defaultVsCurrency;
		const symbol = this.getFiatCurrency(currency)?.symbol;
		let price = '0';

		if (coinId) {
			const raw = super.getPrice(coinId, currency);
			price = raw ? raw.toFixed(decimals) : '0';
		}

		return `${symbol}${price}`;
	}
}
