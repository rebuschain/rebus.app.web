import { makeObservable, observable } from 'mobx';
import env from '@beam-australia/react-env';
import axios from 'axios';
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
	createTxIBCMsgTransfer,
	createTxRawEIP712,
	signatureToWeb3Extension,
	MsgDelegateParams,
	Sender,
	MsgBeginRedelegateParams,
	MsgUndelegateParams,
	MsgMultipleWithdrawDelegatorRewardParams,
	createTxMsgMultipleWithdrawDelegatorReward,
	MessageMsgVote,
	MessageIBCMsgTransfer,
} from '@tharsis/transactions';
import { encrypt } from 'eth-sig-util';
import ascii85 from 'ascii85';
import { ethers } from 'ethers';
import { signatureToPubkey } from '@hanchon/signature-to-pubkey';
import { AminoMsgDelegate, AminoMsgUndelegate, AminoMsgVote, AminoMsgWithdrawDelegatorReward } from '@cosmjs/stargate';
import { DeFiWeb3Connector } from 'deficonnect';
import { InstallError, tendermint } from '@cosmostation/extension-client';
import { WALLET_LIST, WalletTypes } from 'src/constants/wallet';
import { ethToRebus } from 'src/utils/rebus-converter';
import { FalconProvider } from './falcon-provider';
import { TransactionResponse, Tx } from './types';
import { CosmostationProvider } from './cosmostation-provider';
import { BaseProvider } from './base-provider';
import { Int } from '@keplr-wallet/unit';
import { AminoMsgMintNftId, createTxMsgMintNftId, MessageMsgMintNftId } from './messages/mint-nft-id';
import { config } from 'src/config-insync';
import {
	AminoMsgCreateIdRecord,
	createTxMsgCreateIdRecord,
	MessageMsgCreateIdRecord,
} from './messages/create-id-record';

const chainId = env('CHAIN_ID');
const restUrl = env('REST_URL');
const ethChainId = Number(chainId.split('_')[1].split('-')[0]);
const headers = { 'Content-Type': 'application/json' };

export const ENCRYPTION_KEY_KEY = '_r_k';

/**
 * WalletStore permits connecting and using the etherum wallets
 */
export class WalletStore {
	@observable
	public isLoaded = false;
	@observable
	public version: string | undefined;
	@observable
	public accountName = '';
	@observable
	public address = '';
	@observable
	public rebusAddress = '';
	@observable
	public walletType: WalletTypes = undefined;

	private _provider: ethers.providers.Web3Provider | undefined;
	private _aminoProvider: BaseProvider<AminoProviderBase> | undefined;

	private _isEtherumListenerAttached = false;

	constructor() {
		makeObservable(this);
	}

	private get provider() {
		if (!this._provider) {
			throw new Error('Provider not initialized');
		}

		return this._provider;
	}

	private get aminoProvider() {
		if (!this._aminoProvider) {
			throw new Error('Amino Provider not initialized');
		}

		return this._aminoProvider;
	}

	get chainName() {
		let name = env('CHAIN_NAME');

		if (this.version) {
			name += ` v${this.version}`;
		}

		return name;
	}

	get chainInfo() {
		return {
			chainId: ethChainId,
			cosmosChainId: chainId,
		};
	}

	public async init(walletType: WalletTypes, shouldOpenLinkIfProviderNotFound = false, shouldSwitchNetwork = true) {
		if (this.isLoaded) {
			return false;
		}

		const wallet = WALLET_LIST.find(w => w.walletType === walletType);

		if (!wallet) {
			console.error('No wallet type found', walletType);
			return false;
		}

		this.version = wallet.version;

		switch (walletType) {
			case 'metamask':
				if (!window.ethereum?.isMetaMask) {
					if (wallet.link && shouldOpenLinkIfProviderNotFound) {
						window.open(wallet.link);
					}

					return false;
				}

				this._provider = new ethers.providers.Web3Provider(window.ethereum);
				await window.ethereum.enable();

				if (shouldSwitchNetwork) {
					try {
						await this.switchNetwork();
						this._provider = new ethers.providers.Web3Provider(window.ethereum);
					} catch (err) {
						console.error(err);
					}
				}

				if (this._isEtherumListenerAttached) {
					window.ethereum.on('accountsChanged', this.metamaskOnAccountChange);
				}

				break;
			case 'crypto':
				try {
					if (window.deficonnectProvider) {
						await window.deficonnectProvider.enable();
					}

					const connector = new DeFiWeb3Connector({
						supportedChainIds: [ethChainId],
						rpc: {
							[ethChainId]: env('RPC_URL'),
						},
						pollingInterval: 15000,
					});
					await connector.activate();

					const connectorProvider = await connector.getProvider();
					this._provider = new ethers.providers.Web3Provider(connectorProvider);

					if (shouldSwitchNetwork) {
						try {
							if (connectorProvider.chainId !== chainId) {
								await this.switchNetwork();
								this._provider = new ethers.providers.Web3Provider(await connector.getProvider());
							}
						} catch (err) {
							console.error(err);
						}
					}

					connector.on('session_update', this.onUpdate);
					connector.on('Web3ReactDeactivate', this.onUpdate);
					connector.on('Web3ReactUpdate', this.onUpdate);
				} catch (err) {
					console.error(err);
					return false;
				}
				break;
			case 'cosmostation':
				try {
					const provider = await tendermint();
					const tendermintExtendedProvider = provider as TendermintExtended;
					tendermintExtendedProvider.getOfflineAminoSigner = () => tendermintExtendedProvider as any;
					tendermintExtendedProvider.getOfflineSigner = () => tendermintExtendedProvider as any;

					this._aminoProvider = new CosmostationProvider(
						wallet.name,
						tendermintExtendedProvider,
						chainId,
						this.chainName
					);

					await this.aminoProvider.connect();
				} catch (err) {
					if (err instanceof InstallError) {
						if (wallet.link && shouldOpenLinkIfProviderNotFound) {
							window.open(wallet.link);
						}
					} else {
						console.error(err);
					}

					return false;
				}
				break;
			case 'falcon':
				if (!window.falcon) {
					if (wallet.link && shouldOpenLinkIfProviderNotFound) {
						window.open(wallet.link);
					}

					return false;
				}

				this._aminoProvider = new FalconProvider(wallet.name, window.falcon);
				await this.aminoProvider.connect();
				break;
		}

		this.walletType = walletType;

		await this.onUpdate();

		if (this._aminoProvider) {
			this.aminoProvider.onAccountsChanged(this.onUpdate);
		}

		this.isLoaded = true;

		return true;
	}

	public disconnect() {
		if (this._aminoProvider) {
			this.aminoProvider.offAccountsChanged();
		}

		this.version = undefined;
		this.isLoaded = false;
		this.accountName = '';
		this.address = '';
		this.rebusAddress = '';
		this._provider = undefined;
		this._aminoProvider = undefined;
	}

	public getExplorerUrl() {
		if (this.isLoaded && this.walletType === 'metamask') {
			return config.EVM_EXPLORER_URL || config.EXPLORER_URL;
		}

		return config.EXPLORER_URL;
	}

	public async signMessage(message: string) {
		return this.provider.getSigner().signMessage(message);
	}

	public async getPubKey() {
		if (this._aminoProvider) {
			return this.aminoProvider.account?.publicKey || '';
		}

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
				rpcUrls: [env('METAMASK_URL')],
				chainName: this.chainName,
				nativeCurrency: {
					name: env('COIN_DENOM'),
					symbol: env('COIN_DENOM'),
					decimals: parseInt(env('COIN_DECIMALS'), 10),
				},
				blockExplorerUrls: [config.EVM_EXPLORER_URL.split('/tx')[0].split('/transaction')[0]],
			},
		]);
	}

	public async encrypt(text: string) {
		if (!this.isLoaded) {
			return text;
		}

		if (this.walletType === 'metamask') {
			const data = Buffer.from(text, 'base64');

			const keyB64: string = await window.ethereum.request({
				method: 'eth_getEncryptionPublicKey',
				params: [this.address],
			});
			const publicKey = Buffer.from(keyB64, 'base64');

			// Returned object contains 4 properties: version, ephemPublicKey, nonce, ciphertext
			// Each contains data encoded using base64, version is always the same string
			const encrypted = encrypt(
				publicKey.toString('base64'),
				{ data: ascii85.encode(data).toString() },
				'x25519-xsalsa20-poly1305'
			);

			const buf = Buffer.concat([
				Buffer.from(encrypted.ephemPublicKey, 'base64'),
				Buffer.from(encrypted.nonce, 'base64'),
				Buffer.from(encrypted.ciphertext, 'base64'),
			]);

			return buf.toString('base64');
		}

		return text;
	}

	public async decrypt(text: string) {
		if (!this.isLoaded) {
			return text;
		}

		if (this.walletType === 'metamask') {
			const data = Buffer.from(text, 'base64');

			// Reconstructing the original object outputed by encryption
			const structuredData = {
				version: 'x25519-xsalsa20-poly1305',
				ephemPublicKey: data.slice(0, 32).toString('base64'),
				nonce: data.slice(32, 56).toString('base64'),
				ciphertext: data.slice(56).toString('base64'),
			};

			// Convert data to hex string required by MetaMask
			const ct = `0x${Buffer.from(JSON.stringify(structuredData), 'utf8').toString('hex')}`;

			// Send request to MetaMask to decrypt the ciphertext
			const decrypt = await window.ethereum.request({
				method: 'eth_decrypt',
				params: [ct, this.address],
			});

			// Decode the base85 to final bytes
			const res = ascii85.decode(decrypt);

			return res.toString('base64');
		}

		return text;
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

		response.data.sender = sender;

		return response.data;
	}

	public checkIfSupported(
		action: 'ibc-transfer' | 'delegate' | 'un-delegate' | 're-delegate' | 'claim-rewards' | 'vote'
	) {
		if (!this.walletType) {
			throw new Error('No wallet connected');
		}

		if (this.walletType === 'crypto') {
			throw new Error('Transactions not supported for crypto.com wallets');
		}

		if (action === 'ibc-transfer' && this.walletType !== 'metamask') {
			throw new Error('IBC Transfers are only supported on metamask or keplr');
		}
	}

	public async sendIBCTransfer(
		{ fee, msg, memo }: Tx<MessageIBCMsgTransfer>,
		getBlockHeight: () => Promise<Int>
	): Promise<TransactionResponse> {
		this.checkIfSupported('ibc-transfer');

		const sender = await this.getSender();
		const blockHeight = await getBlockHeight();

		if (msg) {
			msg.revisionHeight = parseInt(blockHeight.add(new Int('150')).toString());
		}

		const txMsg = createTxIBCMsgTransfer(this.chainInfo, sender, fee, memo, msg as MessageIBCMsgTransfer);
		return this.broadcast(sender, txMsg);
	}

	public async delegate(
		{ fee, msg, memo }: Tx<MsgDelegateParams>,
		aminoTx: Tx<AminoMsgDelegate>
	): Promise<TransactionResponse> {
		this.checkIfSupported('delegate');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgDelegate>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgDelegate(this.chainInfo, sender, fee, memo, msg as MsgDelegateParams);
		return this.broadcast(sender, txMsg);
	}

	public async unDelegate(
		{ fee, msg, memo }: Tx<MsgUndelegateParams>,
		aminoTx: Tx<AminoMsgUndelegate>
	): Promise<TransactionResponse> {
		this.checkIfSupported('un-delegate');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgUndelegate>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgUndelegate(this.chainInfo, sender, fee, memo, msg as MsgUndelegateParams);
		return this.broadcast(sender, txMsg);
	}

	public async reDelegate(
		{ fee, msg, memo }: Tx<MsgBeginRedelegateParams>,
		aminoTx: Tx<AminoMsgWithdrawDelegatorReward>
	): Promise<TransactionResponse> {
		this.checkIfSupported('re-delegate');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgWithdrawDelegatorReward>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgBeginRedelegate(this.chainInfo, sender, fee, memo, msg as MsgBeginRedelegateParams);
		return this.broadcast(sender, txMsg);
	}

	public async claimRewards(
		{ fee, msg, memo }: Tx<MsgMultipleWithdrawDelegatorRewardParams>,
		aminoTx: Tx<AminoMsgWithdrawDelegatorReward>
	): Promise<TransactionResponse> {
		this.checkIfSupported('claim-rewards');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgWithdrawDelegatorReward>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgMultipleWithdrawDelegatorReward(
			this.chainInfo,
			sender,
			fee,
			memo,
			msg as MsgMultipleWithdrawDelegatorRewardParams
		);
		return this.broadcast(sender, txMsg);
	}

	public async vote({ fee, msg, memo }: Tx<MessageMsgVote>, aminoTx: Tx<AminoMsgVote>): Promise<TransactionResponse> {
		this.checkIfSupported('vote');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgVote>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgVote(this.chainInfo, sender, fee, memo, msg as MessageMsgVote);
		return this.broadcast(sender, txMsg);
	}

	public async mintNftId(
		{ fee, msg, memo }: Tx<MessageMsgMintNftId>,
		aminoTx: Tx<AminoMsgMintNftId>
	): Promise<TransactionResponse> {
		this.checkIfSupported('vote');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgMintNftId>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgMintNftId(this.chainInfo, sender, fee, memo, msg as MessageMsgMintNftId);
		return this.broadcast(sender, txMsg);
	}

	public async createIdRecord(
		{ fee, msg, memo }: Tx<MessageMsgCreateIdRecord>,
		aminoTx: Tx<AminoMsgCreateIdRecord>
	): Promise<TransactionResponse> {
		this.checkIfSupported('vote');

		if (this._aminoProvider) {
			return this.aminoProvider.signAndBroadcastAmino<Tx<AminoMsgCreateIdRecord>>(this.rebusAddress, aminoTx);
		}

		const sender = await this.getSender();
		const txMsg = createTxMsgCreateIdRecord(this.chainInfo, sender, fee, memo, msg as MessageMsgCreateIdRecord);
		return this.broadcast(sender, txMsg);
	}

	private onUpdate = async () => {
		try {
			try {
				if (this._aminoProvider) {
					const account = await this.aminoProvider.getAccount();
					this.accountName = account.name;
					this.address = account.address;
				} else {
					this.address = (await this.provider.listAccounts())?.[0];
					this.accountName = '';
				}
			} catch (err) {
				console.log(err);

				if ((<any>err)?.code === 4100) {
					throw err;
				}
			}

			if (!this.address) {
				throw new Error('No wallet address found, please make sure you switch to the rebus network');
			}

			const isRebusAddress = this.address.startsWith(env('PREFIX'));

			if (!isRebusAddress && !this.address.startsWith('0x')) {
				throw new Error('Invalid wallet address, please try switching to rebus network');
			}

			this.rebusAddress = isRebusAddress ? this.address : ethToRebus(this.address);
		} catch (err) {
			this.disconnect();
			throw err;
		}
	};

	private metamaskOnAccountChange = (accounts: string[]) => {
		if (this.walletType === 'metamask') {
			this.address = accounts[0];
			this.rebusAddress = ethToRebus(this.address);
		}
	};
}
