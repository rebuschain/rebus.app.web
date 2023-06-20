import { ChainGetter, ObservableChainQuery, ObservableChainQueryMap } from '@keplr-wallet/stores';
import { TokenPair, TokenPairsResponse } from './types';
import { KVStore } from '@keplr-wallet/common';
import { computed, makeObservable } from 'mobx';

export class ObservableQueryTokenPairsInner extends ObservableChainQuery<TokenPairsResponse> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter, protected readonly bech32Address: string) {
		super(kvStore, chainId, chainGetter, `/rebus/erc20/v1/token_pairs`);

		makeObservable(this);
	}

	protected canFetch(): boolean {
		return true;
	}

	@computed
	public get tokenPairs(): TokenPair[] | undefined {
		return this.response?.data?.token_pairs;
	}
}

export class ObservableQueryTokenPairs extends ObservableChainQueryMap<TokenPairsResponse> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter, (bech32Address: string) => {
			return new ObservableQueryTokenPairsInner(this.kvStore, this.chainId, this.chainGetter, bech32Address);
		});
	}

	get(): ObservableQueryTokenPairsInner {
		return super.get('') as ObservableQueryTokenPairsInner;
	}
}
