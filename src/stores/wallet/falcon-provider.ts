import env from '@beam-australia/react-env';
import { EmbedChainInfos } from 'src/config';
import { BaseProvider } from './base-provider';

const chainId = env('CHAIN_ID');

export class FalconProvider extends BaseProvider<Falcon> {
	constructor(name = '', provider: Falcon) {
		super(name, provider);
	}

	get falcon() {
		return (this.provider as unknown) as Falcon;
	}

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
}
