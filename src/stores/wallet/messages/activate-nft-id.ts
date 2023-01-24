import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { AminoMsg } from '@cosmjs/amino';
import { MsgActivateNftId } from '../../../proto/rebus/nftid/v1/tx_pb';
import { Coin } from '../../../proto/cosmos/base/v1beta1/coin_pb';

const MSG_ACTIVATE_NFT_ID_TYPES = {
	MsgValue: [
		{ name: 'address', type: 'string' },
		{ name: 'nft_type', type: 'int32' },
		{ name: 'organization', type: 'string' },
		{ name: 'payment_type', type: 'int32' },
		{ name: 'amount', type: 'TypeAmount' },
		{ name: 'timestamp', type: 'string' },
	],
	TypeAmount: [
		{ name: 'denom', type: 'string' },
		{ name: 'amount', type: 'string' },
	],
};

export interface Amount {
	denom: string;
	amount: string;
}

export interface MessageMsgActivateNftId {
	address: string;
	nft_type: number;
	organization: string;
	payment_type: number;
	amount: Amount;
	timestamp: string;
}

export interface AminoMsgActivateNftId extends AminoMsg {
	readonly type: 'rebus.core/MsgActivateNftId';
	readonly value: {
		readonly address: string;
		readonly nft_type: number;
		readonly organization: string;
		readonly payment_type: string;
		readonly amount: Amount;
		readonly timestamp: string;
	};
}

const createMsgActivateNftId = (
	sender: string,
	nftType: number,
	organization: string,
	paymentType: number,
	amount: Amount,
	timestamp: string
) => {
	return {
		type: 'rebus.core/MsgActivateNftId',
		value: {
			address: sender,
			nft_type: nftType,
			organization,
			payment_type: paymentType,
			amount,
			timestamp,
		},
	};
};

const createMsgActivateNftIdCosmos = (
	sender: string,
	nftType: number,
	organization: string,
	paymentType: number,
	amount: Amount,
	timestamp: string
) => {
	const activateNftIdMessage = new MsgActivateNftId();
	activateNftIdMessage.setAddress(sender);
	activateNftIdMessage.setNftType(nftType as any);
	activateNftIdMessage.setOrganization(organization);
	activateNftIdMessage.setPaymentType(paymentType as any);
	activateNftIdMessage.setTimestamp(timestamp);

	const activationFeeCoin = new Coin();
	activationFeeCoin.setAmount(amount.amount);
	activationFeeCoin.setDenom(amount.denom);
	activateNftIdMessage.setAmount(activationFeeCoin);

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
	const msg = createMsgActivateNftId(
		sender.accountAddress,
		params.nft_type,
		params.organization,
		params.payment_type,
		params.amount,
		params.timestamp
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
	const msgCosmos = createMsgActivateNftIdCosmos(
		sender.accountAddress,
		params.nft_type,
		params.organization,
		params.payment_type,
		params.amount,
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
