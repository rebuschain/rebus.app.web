import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { AminoMsg } from '@cosmjs/amino';
import { MsgActivateNftId } from '../../../proto/rebus/nftid/v1/tx_pb';

const MSG_ACTIVATE_NFT_ID_TYPES = {
	MsgValue: [
		{ name: 'address', type: 'string' },
		{ name: 'nft_type', type: 'int32' },
		{ name: 'organization', type: 'string' },
		{ name: 'timestamp', type: 'string' },
	],
};

export interface MessageMsgActivateNftId {
	address: string;
	nft_type: number;
	organization: string;
	timestamp: string;
}

export interface AminoMsgActivateNftId extends AminoMsg {
	readonly type: 'rebus.core/MsgActivateNftId';
	readonly value: {
		readonly address: string;
		readonly nft_type: number;
		readonly organization: string;
		readonly timestamp: string;
	};
}

const createMsgActivateNftId = (sender: string, nftType: number, organization: string, timestamp: string) => {
	return {
		type: 'rebus.core/MsgActivateNftId',
		value: {
			address: sender,
			nft_type: nftType,
			organization,
			timestamp,
		},
	};
};

const createMsgActivateNftIdCosmos = (sender: string, nftType: number, organization: string, timestamp: string) => {
	const activateNftIdMessage = new MsgActivateNftId();
	activateNftIdMessage.setAddress(sender);
	activateNftIdMessage.setNftType(nftType as any);
	activateNftIdMessage.setOrganization(organization);
	activateNftIdMessage.setTimestamp(timestamp);

	return {
		message: activateNftIdMessage,
		path: 'rebus.nftid.v1.MsgActivateNftId',
	};
};

export const createTxMsgActivateNftId = (
	chain: Chain,
	sender: Sender,
	fee: Fee,
	memo: string,
	params: MessageMsgActivateNftId
) => {
	const feeObject = generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
	const types = generateTypes(MSG_ACTIVATE_NFT_ID_TYPES);
	const msg = createMsgActivateNftId(sender.accountAddress, params.nft_type, params.organization, params.timestamp);
	const messages = generateMessage(
		sender.accountNumber.toString(),
		sender.sequence.toString(),
		chain.cosmosChainId,
		memo,
		feeObject,
		msg
	);
	const eipToSign = createEIP712(types, chain.chainId, messages);
	const msgCosmos = createMsgActivateNftIdCosmos(
		sender.accountAddress,
		params.nft_type,
		params.organization,
		params.timestamp
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
