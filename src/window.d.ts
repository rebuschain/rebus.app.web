import { Window as KeplrWindow } from '@keplr-wallet/types';
import { DeFiConnectorProvider } from 'deficonnect';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Window extends KeplrWindow {
		deficonnectProvider?: DeFiConnectorProvider;
	}
}
