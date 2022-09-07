import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { Tendermint } from '@cosmostation/extension-client';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import { DeFiConnectorProvider } from 'deficonnect';
import { ChainInfoWithExplorer } from './stores/chain';

declare global {
	type AminoProviderBase = {
		getOfflineSigner: (chainId: string) => Promise<OfflineDirectSigner>;
		getOfflineAminoSigner: (chainId: string) => OfflineAminoSigner;
	};

	interface Falcon extends AminoProviderBase {
		importZone: (config: ChainInfoWithExplorer) => Promise<void>;
		connect: (chainId: string) => Promise<void>;
	}

	interface TendermintExtended extends Tendermint {
		getOfflineSigner: (chainId: string) => Promise<OfflineDirectSigner>;
		getOfflineAminoSigner: (chainId: string) => OfflineAminoSigner;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Window extends KeplrWindow {
		deficonnectProvider?: DeFiConnectorProvider;
		falcon?: Falcon;
	}
}
