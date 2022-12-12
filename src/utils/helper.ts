import { RPC_URL } from 'src/constants/url';
import { AminoTypes, defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/launchpad';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { config } from 'src/config-insync';
import { getAccount } from 'src/utils/account';
import { Registry } from '@cosmjs/proto-signing';
import { MsgMintNftId } from 'src/proto/rebus/nftid/v1/tx';

const chainId = config.CHAIN_ID;

const registry = new Registry(defaultRegistryTypes);
registry.register('/rebus.nftid.v1.MsgMintNftId', MsgMintNftId);

const aminoTypes = new AminoTypes({
	'/rebus.nftid.v1.MsgMintNftId': {
		aminoType: '/rebus.nftid.v1.MsgMintNftId',
		toAmino: ({ address, nftType, organization, encryptionKey, metadataUrl, mintingFee }) => {
			return {
				address,
				nft_type: nftType,
				organization,
				encryption_key: encryptionKey,
				metadata_url: metadataUrl,
				minting_fee: mintingFee,
			};
		},
		fromAmino: ({ address, nftType, organization, encryption_key, metadata_url, minting_fee }) => {
			return {
				address,
				nftType: nftType,
				organization,
				encryptionKey: encryption_key,
				metadataUrl: metadata_url,
				mintingFee: minting_fee,
			};
		},
	},
});

export const aminoSignTx = async (tx: any, address: string, offlineSigner: OfflineSigner | null, isEvmos: boolean) => {
	if (!offlineSigner) {
		(await window.keplr) && window.keplr?.enable(chainId);
		offlineSigner = (window.getOfflineSigner && window.getOfflineSigner(chainId)) as OfflineSigner;
	}

	const client = await SigningStargateClient.connectWithSigner(RPC_URL, offlineSigner, { aminoTypes, registry });
	const myac = await getAccount(address);

	if (!myac) {
		throw new Error('Account not found');
	}

	const signerData = {
		accountNumber: myac.accountNumber,
		sequence: myac.sequence,
		chainId: chainId,
	};

	const result = await (client as any).signDirect(
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
