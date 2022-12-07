import { ChainGetter, ObservableChainQuery, ObservableChainQueryMap } from '@keplr-wallet/stores';
import { IdRecord, IdRecordResponse } from './types';
import { KVStore } from '@keplr-wallet/common';
import { computed, makeObservable } from 'mobx';

export class ObservableQueryIdRecordInner extends ObservableChainQuery<IdRecordResponse> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter, protected readonly bech32Address: string) {
		super(kvStore, chainId, chainGetter, `/rebus/nftid/v1beta1/id_record/Default/Rebus/${bech32Address}`);

		makeObservable(this);
	}

	protected canFetch(): boolean {
		return !!this.bech32Address;
	}

	@computed
	public get idRecord(): IdRecord | undefined {
		return this.response?.data?.id_record;
	}
}

export class ObservableQueryIdRecord extends ObservableChainQueryMap<IdRecordResponse> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter, (bech32Address: string) => {
			return new ObservableQueryIdRecordInner(this.kvStore, this.chainId, this.chainGetter, bech32Address);
		});
	}

	get(bech32Address: string): ObservableQueryIdRecordInner {
		return super.get(bech32Address) as ObservableQueryIdRecordInner;
	}
}
