import { makeObservable, observable } from 'mobx';
import env from '@beam-australia/react-env';
import axios from 'axios';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import { AppCurrency } from '@keplr-wallet/types';
import {
	BroadcastMode,
	generateEndpointAccount,
	generateEndpointBroadcast,
	generatePostBodyBroadcast,
} from '@tharsis/provider';
import {
	createTxMsgDelegate,
	createTxMsgUndelegate,
	createTxMsgBeginRedelegate,
	createTxMsgVote,
	createTxRawEIP712,
	signatureToWeb3Extension,
	Fee,
	MsgDelegateParams,
	Sender,
	MsgBeginRedelegateParams,
	MsgUndelegateParams,
	MsgMultipleWithdrawDelegatorRewardParams,
	createTxMsgMultipleWithdrawDelegatorReward,
	MessageMsgVote,
} from '@tharsis/transactions';
import { ethers } from 'ethers';
import { signatureToPubkey } from '@hanchon/signature-to-pubkey';
import { SifchainLiquidityAPYResult } from '@keplr-wallet/stores/build/query/cosmos/supply/sifchain';
import { DeFiWeb3Connector } from 'deficonnect';
import { WALLET_LIST } from 'src/constants/wallet';
import { ethToRebus } from 'src/utils/rebus-converter';
import { ChainInfoWithExplorer } from '../chain';

const chainId = env('CHAIN_ID');
const restUrl = env('REST_URL');
const ethChainId = Number(chainId.split('_')[1].split('-')[0]);
const headers = { 'Content-Type': 'application/json' };

type TxResponse = {
	code: number;
	codespace: SifchainLiquidityAPYResult;
	data: string;
	events: any[];
	gas_used: string;
	gas_wanted: string;
	height: string;
	info: string;
	logs: any[];
	raw_log: string;
	timestamp: string;
	tx: any;
	txhash: string;
};

type TransactionResponse = {
	tx_response: TxResponse;
};

/**
 * EtherumStore permits connecting and using the etherum wallets
 */
export class EtherumStore {
	@observable
	public isLoaded = false;
	@observable
	public address = '';
	@observable
	public rebusAddress = '';
	@observable.ref
	public balance: CoinPretty;

	private provider!: ethers.providers.Web3Provider;
	private walletType: 'metamask' | 'crypto' | undefined;

	constructor(protected readonly chain: ChainInfoWithExplorer) {
		this.balance = new CoinPretty(this.currency, new Dec(0));
		this.onAccountChange = this.onAccountChange.bind(this);

		makeObservable(this);
	}

	get chainInfo() {
		return {
			chainId: ethChainId,
			cosmosChainId: chainId,
		};
	}

	get currency() {
		return this.chain.stakeCurrency as AppCurrency;
	}

	public async init(walletType: 'metamask' | 'crypto', shouldOpenLinkIfProviderNotFound = false) {
		if (this.isLoaded) {
			return false;
		}

		const wallet = WALLET_LIST.find(({ etherumWallet }) => etherumWallet === walletType);

		if (!wallet) {
			console.error('No wallet type found', walletType);
			return false;
		}

		switch (walletType) {
			case 'metamask':
				if (!window.ethereum?.isMetaMask) {
					if (wallet.link && shouldOpenLinkIfProviderNotFound) {
						window.open(wallet.link);
					}

					return false;
				}

				this.provider = new ethers.providers.Web3Provider(window.ethereum);
				await window.ethereum.enable();

				try {
					await this.switchNetwork();
					this.provider = new ethers.providers.Web3Provider(window.ethereum);
				} catch (err) {
					console.error(err);
				}
				break;
			case 'crypto':
				try {
					const connector = new DeFiWeb3Connector({
						supportedChainIds: [ethChainId],
						rpc: {
							[ethChainId]: env('RPC_URL'),
						},
						pollingInterval: 15000,
					});
					await connector.activate();
					this.provider = new ethers.providers.Web3Provider(await connector.getProvider());

					try {
						await this.switchNetwork();
						this.provider = new ethers.providers.Web3Provider(await connector.getProvider());
					} catch (err) {
						console.error(err);
					}
				} catch (err) {
					console.error(err);
					return false;
				}
				break;
		}

		this.walletType = walletType;

		try {
			this.address = (await this.provider.listAccounts())?.[0];
		} catch (err) {
			console.log(err);
		}

		if (!this.address) {
			throw new Error('No wallet address found, please make sure you switch to the rebus network');
		}

		if (!this.address.startsWith(env('PREFIX')) && !this.address.startsWith('0x')) {
			throw new Error('Invalid wallet address, please try switching to rebus network');
		}

		this.rebusAddress = ethToRebus(this.address);

		const balanceAmount = await this.provider.getBalance(this.address);
		this.balance = new CoinPretty(this.currency, new Dec(balanceAmount.toBigInt()));

		if (window.ethereum) {
			window.ethereum.on('accountsChanged', this.onAccountChange);
		}

		this.isLoaded = true;

		return true;
	}

	public disconnect() {
		this.isLoaded = false;
		this.address = '';
		this.rebusAddress = '';
	}

	public resetBalance() {
		this.balance = new CoinPretty(this.currency, new Dec(0));
	}

	public async signMessage(message: string) {
		return this.provider.getSigner().signMessage(message);
	}

	public async getPubKey() {
		const signature = await this.provider.getSigner().signMessage('generate_pubkey');

		return signatureToPubkey(
			signature,
			Buffer.from([
				50,
				215,
				18,
				245,
				169,
				63,
				252,
				16,
				225,
				169,
				71,
				95,
				254,
				165,
				146,
				216,
				40,
				162,
				115,
				78,
				147,
				125,
				80,
				182,
				25,
				69,
				136,
				250,
				65,
				200,
				94,
				178,
			])
		);
	}

	public async getSender(): Promise<Sender> {
		const res = await axios.get(`${restUrl}${generateEndpointAccount(this.rebusAddress)}`, { headers });

		if (res.status !== 200 || !res.data) {
			throw new Error('Account not found');
		}

		const {
			account: {
				base_account: { address: accountAddress, account_number: accountNumber, sequence, pub_key: pubkey },
			},
		} = res.data as any;

		return {
			accountAddress,
			accountNumber,
			sequence,
			pubkey: pubkey?.key || (await this.getPubKey()),
		};
	}

	public async switchNetwork(): Promise<void> {
		try {
			const network = await this.provider.getNetwork();
			if (network?.chainId === ethChainId) {
				return Promise.resolve();
			}
		} catch (err) {
			console.error(err);
		}

		return this.provider.send('wallet_addEthereumChain', [
			{
				chainId: `0x${ethChainId.toString(16)}`,
				rpcUrls: [env('RPC_URL')],
				chainName: env('CHAIN_NAME') as string,
				nativeCurrency: {
					name: env('COIN_DENOM'),
					symbol: env('COIN_DENOM'),
					decimals: env('COIN_DECIMALS'),
				},
				blockExplorerUrls: [env('EXPLORER_URL')],
			},
		]);
	}

	public sign(msgToSign: string): Promise<string> {
		return this.provider.send('eth_signTypedData_v4', [this.address, msgToSign]);
	}

	public async broadcast(sender: Sender, tx: any) {
		const signature = await this.sign(JSON.stringify(tx.eipToSign));
		const extension = signatureToWeb3Extension(this.chainInfo, sender, signature);
		const rawTx = createTxRawEIP712(tx.legacyAmino.body, tx.legacyAmino.authInfo, extension);

		const response = await axios.post(
			`${restUrl}${generateEndpointBroadcast()}`,
			generatePostBodyBroadcast(rawTx, BroadcastMode.Block),
			{
				headers,
			}
		);

		return response.data;
	}

	public checkIfSupported() {
		if (this.walletType === 'crypto') {
			throw new Error('Transactions not supported for crypto.com wallets');
		}
	}

	public async delegate(fee: Fee, msg: MsgDelegateParams, memo: string): Promise<TransactionResponse> {
		this.checkIfSupported();
		const sender = await this.getSender();
		const txMsg = createTxMsgDelegate(this.chainInfo, sender, fee, memo, msg);
		return this.broadcast(sender, txMsg);
	}

	public async unDelegate(fee: Fee, msg: MsgUndelegateParams, memo: string): Promise<TransactionResponse> {
		this.checkIfSupported();
		const sender = await this.getSender();
		const txMsg = createTxMsgUndelegate(this.chainInfo, sender, fee, memo, msg);
		return this.broadcast(sender, txMsg);
	}

	public async reDelegate(fee: Fee, msg: MsgBeginRedelegateParams, memo: string): Promise<TransactionResponse> {
		this.checkIfSupported();
		const sender = await this.getSender();
		const txMsg = createTxMsgBeginRedelegate(this.chainInfo, sender, fee, memo, msg);
		return this.broadcast(sender, txMsg);
	}

	public async claimRewards(
		fee: Fee,
		msg: MsgMultipleWithdrawDelegatorRewardParams,
		memo: string
	): Promise<TransactionResponse> {
		const sender = await this.getSender();
		const txMsg = createTxMsgMultipleWithdrawDelegatorReward(this.chainInfo, sender, fee, memo, msg);
		return this.broadcast(sender, txMsg);
	}

	public async vote(fee: Fee, msg: MessageMsgVote, memo: string): Promise<TransactionResponse> {
		this.checkIfSupported();
		const sender = await this.getSender();
		const txMsg = createTxMsgVote(this.chainInfo, sender, fee, memo, msg);
		return this.broadcast(sender, txMsg);
	}

	private onAccountChange(accounts: string[]) {
		this.address = accounts[0];
		this.rebusAddress = ethToRebus(this.address);
	}
}
