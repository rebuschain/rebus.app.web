import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { MsgConvertCoin } from '../../../proto/evmos/erc20/v1/tx_pb';
import { Coin } from '../../../proto/cosmos/base/v1beta1/coin_pb';

const MSG_CONVERT_COIN_TYPES = {
	MsgValue: [
		{ name: 'coin', type: 'TypeCoin' },
		{ name: 'receiver', type: 'string' },
		{ name: 'sender', type: 'string' },
	],
	TypeCoin: [
		{ name: 'denom', type: 'string' },
		{ name: 'amount', type: 'string' },
	],
};

export interface MessageMsgConvertCoin {
	amount: string;
	denom: string;
	sender: string;
	receiver: string;
}

export interface AminoMsgConvertCoin {
	readonly typeUrl: '/rebus.erc20.v1.MsgConvertCoin';
	readonly value: {
		coin: {
			denom: string;
			amount: string;
		};
		receiver: string;
		sender: string;
	};
}

const createMsgConvertCoin = (amount: string, denom: string, sender: string, receiver: string) => {
	return {
		type: 'evmos/MsgConvertCoin',
		value: {
			coin: {
				amount,
				denom,
			},
			sender,
			receiver,
		},
	};
};

const createMsgConvertCoinCosmos = (amount: string, denom: string, sender: string, receiver: string) => {
	const coin = new Coin();
	coin.setAmount(amount);
	coin.setDenom(denom);
	const convertCoinMessage = new MsgConvertCoin();
	convertCoinMessage.setCoin(coin);
	convertCoinMessage.setSender(sender);
	convertCoinMessage.setReceiver(receiver);

	return {
		message: convertCoinMessage,
		path: 'rebus.erc20.v1.MsgConvertCoin',
	};
};

export const createTxMsgConvertCoin = (
	chain: Chain,
	sender: Sender,
	fee: Fee,
	memo: string,
	params: MessageMsgConvertCoin
) => {
	const feeObject = generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
	const types = generateTypes(MSG_CONVERT_COIN_TYPES);
	const msg = createMsgConvertCoin(params.amount, params.denom, params.sender, params.receiver);
	const messages = generateMessage(
		sender.accountNumber.toString(),
		sender.sequence.toString(),
		chain.cosmosChainId,
		memo,
		feeObject,
		msg
	);
	const eipToSign = createEIP712(types, chain.chainId, messages);
	const msgCosmos = createMsgConvertCoinCosmos(params.amount, params.denom, params.sender, params.receiver);
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
