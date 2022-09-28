type PublicKey = {
	type: string;
	value: string;
};

type BaseAccount = {
	address: string;
	public_key: PublicKey;
	account_number: string;
	sequence: string;
};

type Vesting = {
	amount: string;
};

interface BaseVestingAccount extends BaseAccount {
	delegated_vesting: Vesting[];
	original_vesting: Vesting[];
}

interface Result {
	base_account?: BaseAccount;
	base_vesting_account?: BaseVestingAccount;
	code_hash: string;
}

export interface Account {
	height: string;
	result: Result;
}
