import { ChainGetter, ObservableChainQuery, ObservableChainQueryMap } from '@keplr-wallet/stores';
import { KVStore } from '@keplr-wallet/common';
import { computed, makeObservable } from 'mobx';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import { Account } from './types';

export class ObservableQueryAccountRecord extends ObservableChainQuery<Account> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter, protected readonly bech32Address: string) {
		super(kvStore, chainId, chainGetter, `/auth/accounts/${bech32Address}`);

		makeObservable(this);
	}

	protected canFetch(): boolean {
		return !!this.bech32Address;
	}

	@computed
	public get vestingBalance(): CoinPretty {
		const chainInfo = this.chainGetter.getChain(this.chainId);
		const currency = chainInfo.findCurrency(chainInfo.stakeCurrency.coinMinimalDenom);
		if (!currency) {
			throw new Error('Unknown currency');
		}

		const vesting =
			this.response?.data?.result?.base_vesting_account?.original_vesting?.reduce(
				(accumulator: number, currentValue) => {
					return accumulator + (Number(currentValue.amount) || 0);
				},
				0
			) || 0;

		return new CoinPretty(currency, new Dec(vesting));
	}

	@computed
	public get delegatedBalance(): CoinPretty {
		const chainInfo = this.chainGetter.getChain(this.chainId);
		const currency = chainInfo.findCurrency(chainInfo.stakeCurrency.coinMinimalDenom);
		if (!currency) {
			throw new Error('Unknown currency');
		}

		const vesting =
			this.response?.data?.result?.base_vesting_account?.delegated_vesting?.reduce(
				(accumulator: number, currentValue) => {
					return accumulator + (Number(currentValue.amount) || 0);
				},
				0
			) || 0;

		return new CoinPretty(currency, new Dec(vesting));
	}
}

export class ObservableQueryAccount extends ObservableChainQueryMap<Account> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter, (bech32Address: string) => {
			return new ObservableQueryAccountRecord(this.kvStore, this.chainId, this.chainGetter, bech32Address);
		});
	}

	get(bech32Address: string): ObservableQueryAccountRecord {
		return super.get(bech32Address) as ObservableQueryAccountRecord;
	}
}
