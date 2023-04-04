import { createTransaction } from '@tharsis/proto';
import { createEIP712, generateFee, generateMessage, generateTypes } from '@tharsis/eip712';
import { Chain, Fee, Sender } from '@tharsis/transactions';
import { MsgConvertERC20 } from '../../../proto/evmos/erc20/v1/tx_pb';

const MSG_CONVERT_ERC20_TYPES = {
	MsgValue: [
		{ name: 'contract_address', type: 'string' },
		{ name: 'amount', type: 'string' },
		{ name: 'receiver', type: 'string' },
		{ name: 'sender', type: 'string' },
	],
};

export interface MessageMsgConvertERC20 {
	amount: string;
	contractAddress: string;
	sender: string;
	receiver: string;
}

export interface AminoMsgConvertERC20 {
	readonly typeUrl: '/rebus.erc20.v1.MsgConvertERC20';
	readonly value: {
		amount: string;
		contractAddress: string;
		receiver: string;
		sender: string;
	};
}

const createMsgConvertERC20 = (amount: string, contractAddress: string, sender: string, receiver: string) => {
	return {
		type: 'evmos/MsgConvertERC20',
		value: {
			contract_address: contractAddress,
			amount,
			sender,
			receiver,
		},
	};
};

const createMsgConvertERC20Cosmos = (amount: string, contractAddress: string, sender: string, receiver: string) => {
	const convertERC20Message = new MsgConvertERC20();
	convertERC20Message.setAmount(amount);
	convertERC20Message.setContractAddress(contractAddress);
	convertERC20Message.setSender(sender);
	convertERC20Message.setReceiver(receiver);

	return {
		message: convertERC20Message,
		path: 'rebus.erc20.v1.MsgConvertERC20',
	};
};

export const createTxMsgConvertERC20 = (
	chain: Chain,
	sender: Sender,
	fee: Fee,
	memo: string,
	params: MessageMsgConvertERC20
) => {
	const feeObject = generateFee(fee.amount, fee.denom, fee.gas, sender.accountAddress);
	const types = generateTypes(MSG_CONVERT_ERC20_TYPES);
	const msg = createMsgConvertERC20(params.amount, params.contractAddress, params.sender, params.receiver);
	const messages = generateMessage(
		sender.accountNumber.toString(),
		sender.sequence.toString(),
		chain.cosmosChainId,
		memo,
		feeObject,
		msg
	);
	const eipToSign = createEIP712(types, chain.chainId, messages);
	const msgCosmos = createMsgConvertERC20Cosmos(params.amount, params.contractAddress, params.sender, params.receiver);
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
