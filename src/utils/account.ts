import { decodeBech32Pubkey } from '@cosmjs/amino';
import { Uint64 } from '@cosmjs/math/build/integers';
import axios from 'axios';
import { config } from 'src/config-insync';

/**
 * Converts an integer expressed as number or string to a number.
 * Throws if input is not a valid uint64 or if the value exceeds MAX_SAFE_INTEGER.
 *
 * This is needed for supporting Comsos SDK 0.37/0.38/0.39 with one client.
 */
function uint64ToNumber(input: string | number) {
	const value = typeof input === 'number' ? Uint64.fromNumber(input) : Uint64.fromString(input);
	return value.toNumber();
}

/**
 * Converts an integer expressed as number or string to a string.
 * Throws if input is not a valid uint64.
 *
 * This is needed for supporting Comsos SDK 0.37/0.38/0.39 with one client.
 */
function uint64ToString(input: string | number) {
	const value = typeof input === 'number' ? Uint64.fromNumber(input) : Uint64.fromString(input);
	return value.toString();
}

/**
 * Normalizes a pubkey as in `BaseAccount.public_key` to allow supporting
 * Comsos SDK 0.37–0.39.
 *
 * Returns null when unset.
 */
function normalizePubkey(input: any) {
	if (!input) {
		return null;
	}

	if (typeof input === 'string') {
		return decodeBech32Pubkey(input);
	}

	return input;
}

export const getAccount = async function(address: string) {
	const path = config.REST_URL + `/auth/accounts/${address}`;
	const account = await axios.get(path);
	const value = account.data.result.base_account || account.data.result.value?.base_vesting_account?.base_account || {};

	let sequence;
	if (value.sequence === undefined || value.sequence === 0 || value.sequence === '') {
		sequence = 0;
	} else {
		sequence = uint64ToNumber(value.sequence);
	}

	if (!value.address) {
		return undefined;
	}

	return {
		address: value.address,
		balance: 0,
		pubkey: normalizePubkey(value.public_key) || undefined,
		accountNumber: uint64ToNumber(value.account_number),
		sequence: sequence,
	};
};
