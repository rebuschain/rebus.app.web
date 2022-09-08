import env from '@beam-australia/react-env';
import { Account } from './types';
import { BaseProvider } from './base-provider';
import { AccountData, AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';

const chainId = env('CHAIN_ID');
const chainName = env('CHAIN_NAME');

export class CosmostationProvider extends BaseProvider<TendermintExtended> {
	accountsChangedEvent: any;

	constructor(name = '', provider: TendermintExtended) {
		super(name, provider);
	}

	get cosmostation() {
		return (this.provider as unknown) as TendermintExtended;
	}

	onAccountsChanged(callback: () => void) {
		this.accountsChangedEvent = this.cosmostation.onAccountChanged(callback);
	}

	offAccountsChanged() {
		this.cosmostation.offAccountChanged(this.accountsChangedEvent);
	}

	async connect() {
		const supportedChains = await this.cosmostation.getSupportedChains();
		const lowerChainName = chainName.toLowerCase();

		try {
			await this.cosmostation.requestAccount(chainName);
		} catch {
			// Ignore error in case wallet plugin is not connected to the site
		}

		if (supportedChains.official.concat(supportedChains.unofficial).includes(lowerChainName)) {
			return;
		}

		return await this.cosmostation.addChain({
			chainId,
			chainName,
			addressPrefix: env('PREFIX'),
			baseDenom: env('COIN_MINIMAL_DENOM'),
			displayDenom: env('COIN_DENOM'),
			restURL: env('REST_URL'),
			decimals: parseInt(env('COIN_DECIMALS'), 10),
			gasRate: {
				average: env('GAS_PRICE_STEP_AVERAGE'),
				low: env('GAS_PRICE_STEP_LOW'),
				tiny: env('GAS_PRICE_STEP_TINY'),
			},
		});
	}

	async getAccount(): Promise<Account> {
		const account = await this.cosmostation.getAccount(chainName);

		return {
			address: account.address,
			name: account.name,
			publicKey: this.publicKeyToString(account.publicKey),
		};
	}

	getOfflineAminoSigner(): OfflineAminoSigner {
		return {
			getAccounts: async (): Promise<readonly AccountData[]> => {
				const account = await this.cosmostation.getAccount(chainName);

				return [
					{
						address: account?.address,
						pubkey: account?.publicKey,
						algo: 'secp256k1',
					},
				];
			},
			signAmino: async (signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse> => {
				const result = await this.cosmostation.signAmino(chainName, signDoc as any, { memo: true, fee: true });

				return {
					signature: {
						pub_key: result.pub_key,
						signature: result.signature,
					},
					signed: result.signed_doc,
				};
			},
		};
	}
}
