import { ObservableQueryAccount } from './account';
import { ObservableQueryDelegations, ObservableQueryUnbondingDelegations } from './delegations';
import {
	ChainGetter,
	CosmwasmQueries,
	HasCosmwasmQueries,
	QueriesSetBase,
	QueriesWithCosmos,
} from '@keplr-wallet/stores';
import { KVStore } from '@keplr-wallet/common';
import { DeepReadonly } from 'utility-types';
import { ObservableQueryEpochs } from './epochs';
import {
	ObservableQueryAccountLockedCoins,
	ObservableQueryAccountUnlockingCoins,
	ObservableQueryAccountLocked,
	ObservableSyntheticLockupsByLockId,
} from './lockup';
import { ObservableQueryEpochProvisions, ObservableQueryMintParmas } from './mint';
import { ObservableQueryTotalCliamable, ObservableQueryClaimRecord, ObservableQueryClaimParams } from './claim';
import { ObservableQueryGuage } from './incentives';
import { ObservableQueryIdRecord } from './nftid';

export interface HasRebusQueries {
	rebus: RebusQueries;
}

export class QueriesWithCosmosAndRebus extends QueriesWithCosmos implements HasRebusQueries, HasCosmwasmQueries {
	public readonly rebus: DeepReadonly<RebusQueries>;
	public readonly cosmwasm: DeepReadonly<CosmwasmQueries>;

	constructor(kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		super(kvStore, chainId, chainGetter);

		this.rebus = new RebusQueries(this, kvStore, chainId, chainGetter);
		this.cosmwasm = new CosmwasmQueries(this, kvStore, chainId, chainGetter);
	}
}

export class RebusQueries {
	public readonly queryAccount: DeepReadonly<ObservableQueryAccount>;
	public readonly queryDelegations: DeepReadonly<ObservableQueryDelegations>;
	public readonly queryUnbondingDelegations: DeepReadonly<ObservableQueryUnbondingDelegations>;

	public readonly queryLockedCoins: DeepReadonly<ObservableQueryAccountLockedCoins>;
	public readonly queryUnlockingCoins: DeepReadonly<ObservableQueryAccountUnlockingCoins>;
	public readonly queryAccountLocked: DeepReadonly<ObservableQueryAccountLocked>;
	public readonly querySyntheticLockupsByLockId: DeepReadonly<ObservableSyntheticLockupsByLockId>;

	public readonly queryMintParams: DeepReadonly<ObservableQueryMintParmas>;
	public readonly queryEpochProvisions: DeepReadonly<ObservableQueryEpochProvisions>;

	public readonly queryEpochs: DeepReadonly<ObservableQueryEpochs>;

	public readonly queryGauge: DeepReadonly<ObservableQueryGuage>;

	public readonly queryTotalClaimable: DeepReadonly<ObservableQueryTotalCliamable>;
	public readonly queryClaimRecord: DeepReadonly<ObservableQueryClaimRecord>;
	public readonly queryClaimParams: DeepReadonly<ObservableQueryClaimParams>;

	public readonly queryIdRecord: DeepReadonly<ObservableQueryIdRecord>;

	constructor(queries: QueriesSetBase, kvStore: KVStore, chainId: string, chainGetter: ChainGetter) {
		this.queryLockedCoins = new ObservableQueryAccountLockedCoins(kvStore, chainId, chainGetter);
		this.queryUnlockingCoins = new ObservableQueryAccountUnlockingCoins(kvStore, chainId, chainGetter);
		this.queryAccountLocked = new ObservableQueryAccountLocked(kvStore, chainId, chainGetter);
		this.querySyntheticLockupsByLockId = new ObservableSyntheticLockupsByLockId(kvStore, chainId, chainGetter);

		this.queryAccount = new ObservableQueryAccount(kvStore, chainId, chainGetter);
		this.queryDelegations = new ObservableQueryDelegations(kvStore, chainId, chainGetter);
		this.queryUnbondingDelegations = new ObservableQueryUnbondingDelegations(kvStore, chainId, chainGetter);

		this.queryMintParams = new ObservableQueryMintParmas(kvStore, chainId, chainGetter);
		this.queryEpochProvisions = new ObservableQueryEpochProvisions(kvStore, chainId, chainGetter, this.queryMintParams);

		this.queryEpochs = new ObservableQueryEpochs(kvStore, chainId, chainGetter);

		this.queryGauge = new ObservableQueryGuage(kvStore, chainId, chainGetter);

		this.queryTotalClaimable = new ObservableQueryTotalCliamable(kvStore, chainId, chainGetter);
		this.queryClaimRecord = new ObservableQueryClaimRecord(kvStore, chainId, chainGetter);
		this.queryClaimParams = new ObservableQueryClaimParams(kvStore, chainId, chainGetter);

		this.queryIdRecord = new ObservableQueryIdRecord(kvStore, chainId, chainGetter);
	}
}
