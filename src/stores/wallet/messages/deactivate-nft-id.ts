import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { AminoMsg } from '@cosmjs/amino';
import { MsgDeactivateNftId } from '../../../proto/rebus/nftid/v1/tx_pb';
import { Coin } from '../../../proto/cosmos/base/v1beta1/coin_pb';

const MSG_DEACTIVATE_NFT_ID_TYPES = {
	MsgValue: [
		{ name: 'address', type: 'string' },
		{ name: 'nft_type', type: 'int32' },
		{ name: 'organization', type: 'string' },
	],
};

export interface MessageMsgDeactivateNftId {
	address: string;
	nft_type: number;
	organization: string;
}

export interface AminoMsgDeactivateNftId extends AminoMsg {
	readonly type: 'rebus.core/MsgDeactivateNftId';
	readonly value: {
		readonly address: string;
		readonly nft_type: number;
		readonly organization: string;
	};
}

const createMsgDeactivateNftId = (sender: string, nftType: number, organization: string) => {
	return {
		type: 'rebus.core/MsgDeactivateNftId',
		value: {
			address: sender,
			nft_type: nftType,
			organization,
		},
	};
};

const createMsgDeactivateNftIdCosmos = (sender: string, nftType: number, organization: string) => {
	const deactivateNftIdMessage = new MsgDeactivateNftId();
	deactivateNftIdMessage.setAddress(sender);
	deactivateNftIdMessage.setNftType(nftType as any);
	deactivateNftIdMessage.setOrganization(organization);

	return {
		message: deactivateNftIdMessage,
		path: 'rebus.nftid.v1.MsgDeactivateNftId',
	};
};

export const createTxMsgDeactivateNftId = (
	chain: Chain,
	sender: Sender,
	fee: Fee,
	memo: string,
	params: MessageMsgDeactivateNftId
) => {
	const feeObject = generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
	const types = generateTypes(MSG_DEACTIVATE_NFT_ID_TYPES);
	const msg = createMsgDeactivateNftId(sender.accountAddress, params.nft_type, params.organization);
	const messages = generateMessage(
		sender.accountNumber.toString(),
		sender.sequence.toString(),
		chain.cosmosChainId,
		memo,
		feeObject,
		msg
	);
	const eipToSign = createEIP712(types, chain.chainId, messages);
	const msgCosmos = createMsgDeactivateNftIdCosmos(sender.accountAddress, params.nft_type, params.organization);
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
