import { RPC_URL } from 'src/constants/url';
import { SigningStargateClient } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/launchpad';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { config } from 'src/config-insync';
import { getAccount } from 'src/utils/account';

const chainId = config.CHAIN_ID;

export const aminoSignTx = async (tx: any, address: string, offlineSigner: OfflineSigner | null, isEvmos: boolean) => {
	if (!offlineSigner) {
		(await window.keplr) && window.keplr?.enable(chainId);
		offlineSigner = (window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId)) as OfflineSigner;
	}

	const client = await SigningStargateClient.connectWithSigner(RPC_URL, offlineSigner);
	const myac = await getAccount(address);

	if (!myac) {
		throw new Error('Account not found');
	}

	const signerData = {
		accountNumber: myac.accountNumber,
		sequence: myac.sequence,
		chainId: chainId,
	};

	const result = await (client as any).signAmino(
		address,
		tx.msgs ? tx.msgs : [tx.msg],
		tx.fee,
		tx.memo,
		signerData,
		isEvmos
	);

	const txBytes = TxRaw.encode(result).finish();

	return client.broadcastTx(txBytes);
};
