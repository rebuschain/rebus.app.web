import { RPC_URL } from 'src/constants/url';
import { AminoTypes, defaultRegistryTypes, SigningStargateClient } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/launchpad';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { config } from 'src/config-insync';
import { getAccount } from 'src/utils/account';
import { Registry } from '@cosmjs/proto-signing';
import { MsgActivateNftId, MsgDeactivateNftId, MsgMintNftId } from 'src/proto/rebus/nftid/v1/tx';

const chainId = config.CHAIN_ID;

const registry = new Registry(defaultRegistryTypes);
registry.register('/rebus.nftid.v1.MsgMintNftId', MsgMintNftId);
registry.register('/rebus.nftid.v1.MsgCreateIdRecord', MsgMintNftId);
registry.register('/rebus.nftid.v1.MsgActivateNftId', MsgActivateNftId);
registry.register('/rebus.nftid.v1.MsgDeactivateNftId', MsgDeactivateNftId);

const aminoTypes = new AminoTypes({
	additions: {
		'/rebus.nftid.v1.MsgMintNftId': {
			aminoType: 'rebus.core/MsgMintNftId',
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
			fromAmino: ({ address, nft_type, organization, encryption_key, metadata_url, minting_fee }) => {
				return {
					address,
					nftType: nft_type,
					organization,
					encryptionKey: encryption_key,
					metadataUrl: metadata_url,
					mintingFee: minting_fee,
				};
			},
		},
		'/rebus.nftid.v1.MsgCreateIdRecord': {
			aminoType: 'rebus.core/MsgCreateIdRecord',
			toAmino: ({ address, nftType, organization }) => {
				return {
					address,
					nft_type: nftType,
					organization,
				};
			},
			fromAmino: ({ address, nft_type, organization }) => {
				return {
					address,
					nftType: nft_type,
					organization,
				};
			},
		},
		'/rebus.nftid.v1.MsgActivateNftId': {
			aminoType: 'rebus.core/MsgActivateNftId',
			toAmino: ({ address, nftType, organization, paymentType, timestamp, amount }) => {
				return {
					address,
					nft_type: nftType,
					organization,
					payment_type: paymentType,
					amount,
					timestamp,
				};
			},
			fromAmino: ({ address, nft_type, organization, payment_type, timestamp, amount }) => {
				return {
					address,
					nftType: nft_type,
					organization,
					paymentType: payment_type,
					amount,
					timestamp,
				};
			},
		},
		'/rebus.nftid.v1.MsgDeactivateNftId': {
			aminoType: 'rebus.core/MsgDeactivateNftId',
			toAmino: ({ address, nftType, organization }) => {
				return {
					address,
					nft_type: nftType,
					organization,
				};
			},
			fromAmino: ({ address, nft_type, organization }) => {
				return {
					address,
					nftType: nft_type,
					organization,
				};
			},
		},
	},
});

export const aminoSignTx = async (tx: any, address: string, offlineSigner: OfflineSigner | null, isEvmos: boolean) => {
	if (!offlineSigner) {
		(await window.keplr) && window.keplr?.enable(chainId);
		offlineSigner = (window.getOfflineSignerOnlyAmino && window.getOfflineSignerOnlyAmino(chainId)) as OfflineSigner;
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

	const result = await client.sign(address, tx.msgs ? tx.msgs : [tx.msg], tx.fee, tx.memo, signerData, isEvmos);

	const txBytes = TxRaw.encode(result).finish();

	return client.broadcastTx(txBytes);
};
