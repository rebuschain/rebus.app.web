import { ChainGetter, ObservableChainQuery, ObservableChainQueryMap } from '@keplr-wallet/stores';
import { SpendableBalanceResponse } from './types';
import { KVStore } from '@keplr-wallet/common';
import { makeObservable } from 'mobx';
import { AppCurrency } from '@keplr-wallet/types';
import { CoinPretty, Int } from '@keplr-wallet/unit';

export class ObservableQuerySpendableBalanceInner extends ObservableChainQuery<SpendableBalanceResponse> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter, protected readonly bech32Address: string) {
		super(kvStore, chainId, chainGetter, `/cosmos/bank/v1beta1/spendable_balances/${bech32Address}`);

		makeObservable(this);
	}

	protected canFetch(): boolean {
		return true;
	}

	balance(currency: AppCurrency) {
		const balance = this.response?.data?.balances?.find(bal => bal.denom === currency.coinMinimalDenom);
		if (!balance) {
			return new CoinPretty(currency, new Int(0)).ready(false);
		}
		return new CoinPretty(currency, balance.amount);
	}
}

export class ObservableQuerySpendableBalance extends ObservableChainQueryMap<SpendableBalanceResponse> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter, (bech32Address: string) => {
			return new ObservableQuerySpendableBalanceInner(this.kvStore, this.chainId, this.chainGetter, bech32Address);
		});
	}

	get(bech32Address: string): ObservableQuerySpendableBalanceInner {
		return super.get(bech32Address) as ObservableQuerySpendableBalanceInner;
	}
}
