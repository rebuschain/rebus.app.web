import { ChainGetter, ObservableChainQuery, ObservableChainQueryMap } from '@keplr-wallet/stores';
import { KVStore } from '@keplr-wallet/common';
import { makeObservable } from 'mobx';
import { Delegations } from './types';

export class ObservableQueryUnbondingDelegationsRecord extends ObservableChainQuery<Delegations> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter, protected readonly bech32Address: string) {
		super(kvStore, chainId, chainGetter, `/staking/delegators/${bech32Address}/unbonding_delegations`);

		makeObservable(this);
	}

	protected canFetch(): boolean {
		return !!this.bech32Address;
	}
}

export class ObservableQueryUnbondingDelegations extends ObservableChainQueryMap<Delegations> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter, (bech32Address: string) => {
			return new ObservableQueryUnbondingDelegationsRecord(this.kvStore, this.chainId, this.chainGetter, bech32Address);
		});
	}

	get(bech32Address: string): ObservableQueryUnbondingDelegationsRecord {
		return super.get(bech32Address) as ObservableQueryUnbondingDelegationsRecord;
	}
}
