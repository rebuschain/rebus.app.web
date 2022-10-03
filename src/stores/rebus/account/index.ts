import {
	ChainGetter,
	QueriesStore,
	AccountSetBase,
	CosmosMsgOpts,
	HasCosmosQueries,
	AccountWithCosmos,
	QueriesSetBase,
	AccountSetOpts,
	CosmosAccount,
	HasCosmosAccount,
	HasCosmwasmAccount,
	HasCosmwasmQueries,
	CosmwasmAccount,
	AccountWithCosmwasm,
	CosmwasmMsgOpts,
} from '@keplr-wallet/stores';
import { DeepReadonly } from 'utility-types';
import { HasRebusQueries } from '../query';
import deepmerge from 'deepmerge';

export interface HasRebusAccount {
	rebus: DeepReadonly<RebusAccount>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type RebusMsgOpts = {};

export class AccountWithCosmosAndRebus
	extends AccountSetBase<
		CosmosMsgOpts & RebusMsgOpts & CosmwasmMsgOpts,
		HasCosmosQueries & HasRebusQueries & HasCosmwasmQueries
	>
	implements HasCosmosAccount, HasRebusAccount, HasCosmwasmAccount {
	public readonly cosmos: DeepReadonly<CosmosAccount>;
	public readonly rebus: DeepReadonly<RebusAccount>;
	public readonly cosmwasm: DeepReadonly<CosmwasmAccount>;

	static readonly defaultMsgOpts: CosmosMsgOpts & RebusMsgOpts & CosmwasmMsgOpts = deepmerge(
		AccountWithCosmos.defaultMsgOpts,
		deepmerge(AccountWithCosmwasm.defaultMsgOpts, {})
	);

	constructor(
		protected readonly eventListener: {
			addEventListener: (type: string, fn: () => unknown) => void;
			removeEventListener: (type: string, fn: () => unknown) => void;
		},
		protected readonly chainGetter: ChainGetter,
		protected readonly chainId: string,
		protected readonly queriesStore: QueriesStore<
			QueriesSetBase & HasCosmosQueries & HasRebusQueries & HasCosmwasmQueries
		>,
		protected readonly opts: AccountSetOpts<CosmosMsgOpts & RebusMsgOpts & CosmwasmMsgOpts>
	) {
		super(eventListener, chainGetter, chainId, queriesStore, opts);

		this.cosmos = new CosmosAccount(
			this as AccountSetBase<CosmosMsgOpts, HasCosmosQueries>,
			chainGetter,
			chainId,
			queriesStore
		);
		this.rebus = new RebusAccount(
			this as AccountSetBase<RebusMsgOpts, HasRebusQueries>,
			chainGetter,
			chainId,
			queriesStore
		);
		this.cosmwasm = new CosmwasmAccount(
			this as AccountSetBase<CosmwasmMsgOpts, HasCosmwasmQueries>,
			chainGetter,
			chainId,
			queriesStore
		);
	}
}

export class RebusAccount {
	isEvmos = false;

	constructor(
		protected readonly base: AccountSetBase<RebusMsgOpts, HasRebusQueries>,
		protected readonly chainGetter: ChainGetter,
		protected readonly chainId: string,
		protected readonly queriesStore: QueriesStore<QueriesSetBase & HasRebusQueries>
	) {}

	protected changeDecStringToProtoBz(decStr: string): string {
		let r = decStr;
		while (r.length >= 2 && (r.startsWith('.') || r.startsWith('0'))) {
			r = r.slice(1);
		}

		return r;
	}

	protected get queries(): DeepReadonly<QueriesSetBase & HasRebusQueries> {
		return this.queriesStore.get(this.chainId);
	}
}
