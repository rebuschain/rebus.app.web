import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { AminoMsg } from '@cosmjs/amino';
import { MsgCreateIdRecord } from '../../../proto/rebus/nftid/v1/tx_pb';
import { Coin } from '../../../proto/cosmos/base/v1beta1/coin_pb';

const MSG_CREATE_ID_RECORD_TYPES = {
	MsgValue: [
		{ name: 'address', type: 'string' },
		{ name: 'nft_type', type: 'int32' },
		{ name: 'organization', type: 'string' },
	],
};

export interface Amount {
	denom: string;
	amount: string;
}

export interface MessageMsgCreateIdRecord {
	address: string;
	nft_type: number;
	organization: string;
}

export interface AminoMsgCreateIdRecord extends AminoMsg {
	readonly type: 'rebus.core/MsgCreateIdRecord';
	readonly value: {
		readonly address: string;
		readonly nft_type: number;
		readonly organization: string;
	};
}

const createMsgCreateIdRecord = (sender: string, nftType: number, organization: string) => {
	return {
		type: 'rebus.core/MsgCreateIdRecord',
		value: {
			address: sender,
			nft_type: nftType,
			organization,
		},
	};
};

const createMsgCreateIdRecordCosmos = (sender: string, nftType: number, organization: string) => {
	const CreateIdRecordMessage = new MsgCreateIdRecord();
	CreateIdRecordMessage.setAddress(sender);
	CreateIdRecordMessage.setNftType(nftType as any);
	CreateIdRecordMessage.setOrganization(organization);

	return {
		message: CreateIdRecordMessage,
		path: 'rebus.nftid.v1.MsgCreateIdRecord',
	};
};

export const createTxMsgCreateIdRecord = (
	chain: Chain,
	sender: Sender,
	fee: Fee,
	memo: string,
	params: MessageMsgCreateIdRecord
) => {
	const feeObject = generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
	const types = generateTypes(MSG_CREATE_ID_RECORD_TYPES);
	const msg = createMsgCreateIdRecord(sender.accountAddress, params.nft_type, params.organization);
	const messages = generateMessage(
		sender.accountNumber.toString(),
		sender.sequence.toString(),
		chain.cosmosChainId,
		memo,
		feeObject,
		msg
	);
	const eipToSign = createEIP712(types, chain.chainId, messages);
	const msgCosmos = createMsgCreateIdRecordCosmos(sender.accountAddress, params.nft_type, params.organization);
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
