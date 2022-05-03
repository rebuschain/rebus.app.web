import { computed, makeObservable, observable } from 'mobx';

import { ChainStore as BaseChainStore } from '@keplr-wallet/stores';

import { ChainInfo } from '@keplr-wallet/types';

export interface ChainInfoWithExplorer extends ChainInfo {
	// Formed as "https://explorer.com/{txHash}"
	explorerUrlToTx: string;
}

export class ChainStore extends BaseChainStore<ChainInfoWithExplorer> {
	@observable
	protected readonly rebusChainId: string;
	@observable
	protected readonly osmosisChainId: string;

	constructor(embedChainInfos: ChainInfoWithExplorer[], rebusChainId: string, osmosisChainId: string) {
		super(embedChainInfos);

		this.rebusChainId = rebusChainId;
		this.osmosisChainId = osmosisChainId;

		makeObservable(this);
	}

	@computed
	get current(): ChainInfoWithExplorer {
		if (this.hasChain(this.rebusChainId)) {
			return this.getChain(this.rebusChainId).raw;
		}

		throw new Error('rebus chain not set');
	}

	@computed
	get currentFluent() {
		if (this.hasChain(this.rebusChainId)) {
			return this.getChain(this.rebusChainId);
		}

		throw new Error('rebus chain not set');
	}

	@computed
	get currentOsmosis(): ChainInfoWithExplorer {
		if (this.hasChain(this.osmosisChainId)) {
			return this.getChain(this.osmosisChainId).raw;
		}

		throw new Error('osmosis chain not set');
	}

	@computed
	get currentFluentOsmosis() {
		if (this.hasChain(this.osmosisChainId)) {
			return this.getChain(this.osmosisChainId);
		}

		throw new Error('osmosis chain not set');
	}
}
