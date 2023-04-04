import { config } from 'src/config-insync';

export function isSlippageError(tx: any): boolean {
	if (tx && tx.code === 7 && tx.codespace === 'gamm' && tx.log?.includes('token is lesser than min amount')) {
		return true;
	}
	return false;
}

export const getGasAmount = (gas: number) => ({
	amount: String(BigInt(gas * config.GAS_PRICE_STEP_AVERAGE)),
	denom: config.COIN_MINIMAL_DENOM,
});

export const getAminoTx = <MsgType>(gas: number, msg: MsgType) => ({
	msg,
	fee: {
		amount: [getGasAmount(gas)],
		gas: String(gas),
	},
	memo: '',
});

export const getEthTx = <MsgType>(gas: number, msg: MsgType) => ({
	fee: {
		...getGasAmount(gas),
		gas: String(gas),
	},
	msg,
	memo: '',
});
