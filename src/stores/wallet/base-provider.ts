import env from '@beam-australia/react-env';
import { Account, TransactionResponse, TxResponse } from './types';
import { aminoSignTx } from '../../utils/helper';

const chainId = env('CHAIN_ID');

export class BaseProvider<T extends AminoProviderBase> {
	account: Account | null = null;
	name = '';
	_provider: T;

	constructor(name = '', provider: T) {
		this.name = name;
		this._provider = provider;
	}

	get provider() {
		if (!this._provider) {
			throw new Error(`${this.name} is not available`);
		}

		return this._provider;
	}

	connect() {}
	onAccountsChanged(callback: () => void) {}
	offAccountsChanged() {}

	publicKeyToString(publicKey: Uint8Array) {
		return btoa(String.fromCharCode.apply(null, publicKey as any));
	}

	getOfflineAminoSigner() {
		return this.provider.getOfflineAminoSigner(chainId);
	}

	async getAccount(): Promise<Account> {
		const offlineSigner = await this.provider.getOfflineSigner(chainId);
		const accounts = await offlineSigner.getAccounts();
		this.account = {
			address: accounts[0].address,
			name: '',
			publicKey: this.publicKeyToString(accounts[0].pubkey),
		};

		return this.account;
	}

	public async signAndBroadcastAmino<T>(address: string, aminoTx: T): Promise<TransactionResponse> {
		const res = await aminoSignTx(aminoTx, address, this.getOfflineAminoSigner(), false);

		const txResponse: TxResponse = {
			code: res?.code,
			gas_used: res?.gasUsed?.toString(),
			gas_wanted: res?.gasWanted?.toString(),
			height: res?.height?.toString(),
			raw_log: res?.rawLog as string,
			txhash: res?.transactionHash,
		};
		try {
			txResponse.events = JSON.parse(res?.rawLog as string)[0].events;
		} catch {}

		return {
			tx_response: txResponse,
		};
	}
}
