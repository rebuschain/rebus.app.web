import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { AminoMsg } from '@cosmjs/amino';
import { MsgMintNftId } from 'src/proto/rebus/nftid/v1/tx';
import { NftId } from 'src/proto/rebus/nftid/v1/id';

const MSG_MINT_NFT_ID_TYPES = {
	MsgValue: [
		{ name: 'address', type: 'string' },
		{ name: 'nft_type', type: 'int32' },
		{ name: 'organization', type: 'string' },
		{ name: 'encryption_key', type: 'string' },
		{ name: 'metadata_url', type: 'string' },
	],
};

export interface MessageMsgMintNftId {
	address: string;
	nft_type: number;
	organization: string;
	encryption_key: string;
	metadata_url: string;
}

export interface AminoMsgMintNftId extends AminoMsg {
	readonly type: 'rebus/nftid/v1/tx/mint_nft_id';
	readonly value: {
		readonly address: string;
		readonly nft_type: NftId;
		readonly organization: string;
		readonly encryption_key: string;
		readonly metadata_url: string;
	};
}

const createMsgMintNftId = (
	sender: string,
	nftType: number,
	organization: string,
	encryptionKey: string,
	metadataUrl: string
) => {
	return {
		type: 'rebus/nftid/v1/tx/mint_nft_id',
		value: {
			address: sender,
			nft_type: nftType,
			organization,
			encryption_key: encryptionKey,
			metadata_url: metadataUrl,
		},
	};
};

const createMsgMintNftIdCosmos = (
	sender: string,
	nftType: number,
	organization: string,
	encryptionKey: string,
	metadataUrl: string
) => {
	const mintNftIdMessage = MsgMintNftId.fromJSON({
		address: sender,
		nftType,
		organization,
		encryptionKey,
		metadataUrl,
	});
	(mintNftIdMessage as any).serializeBinary = () => MsgMintNftId.encode(mintNftIdMessage).finish();

	return {
		message: mintNftIdMessage,
		path: 'rebus.nftid.v1.MsgMintNftId',
	};
};

export const createTxMsgMintNftId = (
	chain: Chain,
	sender: Sender,
	fee: Fee,
	memo: string,
	params: MessageMsgMintNftId
) => {
	const feeObject = generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
	const types = generateTypes(MSG_MINT_NFT_ID_TYPES);
	const msg = createMsgMintNftId(
		sender.accountAddress,
		params.nft_type,
		params.organization,
		params.encryption_key,
		params.metadata_url
	);
	const messages = generateMessage(
		sender.accountNumber.toString(),
		sender.sequence.toString(),
		chain.cosmosChainId,
		memo,
		feeObject,
		msg
	);
	const eipToSign = createEIP712(types, chain.chainId, messages);
	const msgCosmos = createMsgMintNftIdCosmos(
		sender.accountAddress,
		params.nft_type,
		params.organization,
		params.encryption_key,
		params.metadata_url
	);
	const tx = createTransaction(
		msgCosmos,
		memo,
		fee.amount,
		fee.denom,
		parseInt(fee.gas, 10),
		'ethsecp256',
		sender.pubkey,
		sender.sequence,
		sender.accountNumber,
		chain.cosmosChainId
	);

	return {
		signDirect: tx.signDirect,
		legacyAmino: tx.legacyAmino,
		eipToSign,
	};
};
