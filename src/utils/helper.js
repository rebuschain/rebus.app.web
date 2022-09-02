import { REST_URL, RPC_URL } from 'src/constants/url';
import { SigningStargateClient } from '@cosmjs/stargate';
import { SigningCosmosClient } from '@cosmjs/launchpad';
import { makeSignDoc } from '@cosmjs/amino';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { config } from 'src/config-insync';
import { getAccount } from 'src/utils/account';

const chainId = config.CHAIN_ID;

export const initializeChain = cb => {
	(async () => {
		if (!window.getOfflineSignerOnlyAmino || !window.keplr) {
			const error = 'Please install keplr extension';
			cb(error);
		}

		if (window.keplr) {
			await window.keplr.enable(chainId);

			const offlineSigner = window.getOfflineSignerOnlyAmino(chainId);
			const accounts = await offlineSigner.getAccounts();
			cb(null, accounts);
		} else {
			return null;
		}
	})();
};

export const signTxAndBroadcast = (tx, address, cb) => {
	(async () => {
		(await window.keplr) && window.keplr.enable(chainId);
		const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
		const client = await SigningStargateClient.connectWithSigner(RPC_URL, offlineSigner);
		client
			.signAndBroadcast(address, tx.msgs ? tx.msgs : [tx.msg], tx.fee, tx.memo)
			.then(result => {
				if (result && result.code !== undefined && result.code !== 0) {
					cb(result.log || result.rawLog);
				} else {
					cb(null, result);
				}
			})
			.catch(error => {
				cb(error && error.message);
			});
	})();
};

export const cosmosSignTxAndBroadcast = (tx, address, cb) => {
	(async () => {
		(await window.keplr) && window.keplr.enable(chainId);
		const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
		const cosmJS = new SigningCosmosClient(REST_URL, address, offlineSigner);

		cosmJS
			.signAndBroadcast(tx.msg, tx.fee, tx.memo)
			.then(result => {
				if (result && result.code !== undefined && result.code !== 0) {
					cb(result.log || result.rawLog);
				} else {
					cb(null, result);
				}
			})
			.catch(error => {
				cb(error && error.message);
			});
	})();
};

export const aminoSignTxAndBroadcast = (tx, address, cb) => {
	(async () => {
		(await window.keplr) && window.keplr.enable(chainId);
		const offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);

		const client2 = await SigningStargateClient.connectWithSigner(RPC_URL, offlineSigner);
		const account = {};
		try {
			const { accountNumber, sequence } = await client2.getSequence(address);
			account.accountNumber = accountNumber;
			account.sequence = sequence;
		} catch (e) {
			account.accountNumber = 0;
			account.sequence = 0;
		}
		const signDoc = makeSignDoc(
			tx.msgs ? tx.msgs : [tx.msg],
			tx.fee,
			chainId,
			tx.memo,
			account.accountNumber,
			account.sequence
		);

		const { signed, signature } = await offlineSigner.signAmino(address, signDoc);

		const msg = signed.msgs ? signed.msgs : [signed.msg];
		const fee = signed.fee;
		const memo = signed.memo;

		const voteTx = {
			msg,
			fee,
			memo,
			signatures: [signature],
		};

		client2
			.broadcastTx(voteTx)
			.then(result => {
				if (result && result.code !== undefined && result.code !== 0) {
					cb(result.log || result.rawLog);
				} else {
					cb(null, result);
				}
			})
			.catch(error => {
				cb(error && error.message);
			});
	})();
};

export const aminoSignTx = async (tx, address, offlineSigner) => {
	if (!offlineSigner) {
		(await window.keplr) && window.keplr.enable(chainId);
		offlineSigner = window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId);
	}

	const client = await SigningStargateClient.connectWithSigner(RPC_URL, offlineSigner);

	let signerData;

	const myac = await getAccount(address);

	if (!myac) {
		throw new Error('Account not found');
	}

	signerData = {
		accountNumber: myac.accountNumber,
		sequence: myac.sequence,
		chainId: chainId,
	};

	const result = await client.signAmino(address, tx.msgs ? tx.msgs : [tx.msg], tx.fee, tx.memo, signerData);

	const txBytes = TxRaw.encode(result).finish();

	return client.broadcastTx(txBytes);
};
