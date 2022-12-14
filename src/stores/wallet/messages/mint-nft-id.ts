import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { AminoMsg } from '@cosmjs/amino';
import { MsgMintNftId } from '../../../proto/rebus/nftid/v1/tx_pb';
import { Coin } from '../../../proto/cosmos/base/v1beta1/coin_pb';

const MSG_MINT_NFT_ID_TYPES = {
	MsgValue: [
		{ name: 'address', type: 'string' },
		{ name: 'nft_type', type: 'int32' },
		{ name: 'organization', type: 'string' },
		{ name: 'encryption_key', type: 'string' },
		{ name: 'metadata_url', type: 'string' },
		{ name: 'minting_fee', type: 'TypeMintingFee' },
	],
	TypeMintingFee: [
		{ name: 'denom', type: 'string' },
		{ name: 'amount', type: 'string' },
	],
};

export interface Amount {
	denom: string;
	amount: string;
}

export interface MessageMsgMintNftId {
	address: string;
	nft_type: number;
	organization: string;
	encryption_key: string;
	metadata_url: string;
	minting_fee: Amount;
}

export interface AminoMsgMintNftId extends AminoMsg {
	readonly type: 'rebus.core/MsgMintNftId';
	readonly value: {
		readonly address: string;
		readonly nft_type: number;
		readonly organization: string;
		readonly encryption_key: string;
		readonly metadata_url: string;
		readonly minting_fee: Amount;
	};
}

const createMsgMintNftId = (
	sender: string,
	nftType: number,
	organization: string,
	encryptionKey: string,
	metadataUrl: string,
	mintingFee: Amount
) => {
	return {
		type: 'rebus.core/MsgMintNftId',
		value: {
			address: sender,
			nft_type: nftType,
			organization,
			encryption_key: encryptionKey,
			metadata_url: metadataUrl,
			minting_fee: mintingFee,
		},
	};
};

const createMsgMintNftIdCosmos = (
	sender: string,
	nftType: number,
	organization: string,
	encryptionKey: string,
	metadataUrl: string,
	mintingFee: Amount
) => {
	const mintNftIdMessage = new MsgMintNftId();
	mintNftIdMessage.setAddress(sender);
	mintNftIdMessage.setNftType(nftType as any);
	mintNftIdMessage.setOrganization(organization);
	mintNftIdMessage.setEncryptionKey(encryptionKey);
	mintNftIdMessage.setMetadataUrl(metadataUrl);

	const mintingFeeCoin = new Coin();
	mintingFeeCoin.setAmount(mintingFee.amount);
	mintingFeeCoin.setDenom(mintingFee.denom);
	mintNftIdMessage.setMintingFee(mintingFeeCoin);

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
		params.metadata_url,
		params.minting_fee
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
		params.metadata_url,
		params.minting_fee
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
