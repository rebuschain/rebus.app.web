import env from '@beam-australia/react-env';
import { EmbedChainInfos } from 'src/config';
import { TransactionResponse, TxResponse } from './types';
import { aminoSignTx } from '../../utils/helper';

const chainId = env('CHAIN_ID');

export class AminoProvider<T extends AminoProviderBase> {
	pubKeysByAddressMap: Record<string, string> = {};
	name = '';
	windowProviderKey = '';

	constructor(name = '', windowProviderKey = '') {
		this.name = name;
		this.windowProviderKey = windowProviderKey;
	}

	get provider() {
		const provider = (<any>window)[this.windowProviderKey];

		if (!provider) {
			throw new Error(`${this.name} is not available`);
		}

		return provider as T;
	}

	get falcon() {
		return (this.provider as unknown) as Falcon;
	}

	// Falcon methods
	async connect() {
		await this.importZone();
		await this.falcon.connect(chainId);
	}

	async importZone() {
		try {
			await this.falcon.importZone(EmbedChainInfos[0]);
		} catch (e) {
			console.log(e);
		}
	}

	// Common methods
	getOfflineAminoSigner() {
		return this.provider.getOfflineAminoSigner(chainId);
	}

	async listAccounts(): Promise<string[]> {
		const offlineSigner = await this.provider.getOfflineSigner(chainId);
		const accounts = await offlineSigner.getAccounts();

		this.pubKeysByAddressMap = accounts.reduce((acc, account) => {
			acc[account.address] = btoa(String.fromCharCode.apply(null, account.pubkey as any));
			return acc;
		}, {} as Record<string, string>);

		return accounts.map(account => account.address);
	}

	public async signAndBroadcastAmino<T>(address: string, aminoTx: T): Promise<TransactionResponse> {
		const res = await aminoSignTx(aminoTx, address, this.getOfflineAminoSigner());

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
