import { ClaimParams } from './types';
import { KVStore } from '@keplr-wallet/common';
import { ChainGetter, ObservableChainQuery } from '@keplr-wallet/stores';
import { computed, makeObservable } from 'mobx';
import { Duration } from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

export class ObservableQueryClaimParams extends ObservableChainQuery<ClaimParams> {
	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter, `/rebus/claim/v1beta1/params`);

		makeObservable(this);
	}

	@computed
	get hasResponse(): boolean {
		return !!this.response;
	}

	@computed
	get claimEnabled(): boolean {
		return this.response?.data?.params?.claim_enabled ?? false;
	}

	@computed
	get airdropStartTime(): Date {
		if (!this.response) {
			return new Date(0);
		}

		return new Date(this.response.data.params.airdrop_start_time);
	}

	@computed
	get timeUntilClaim(): Date {
		return dayjs(this.airdropStartTime).toDate();
	}

	@computed
	get timeUntilEnd(): Date {
		const airdropStartTime = dayjs(this.airdropStartTime);
		return airdropStartTime.add(this.airdropDuration).toDate();
	}

	@computed
	get airdropDuration(): Duration {
		if (!this.response?.data?.params) {
			return dayjs.duration(0);
		}

		return dayjs.duration(parseInt(this.response.data.params.airdrop_duration.replace('s', '')) * 1000);
	}
}
