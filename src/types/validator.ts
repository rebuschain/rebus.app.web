export type ValidatorDescription = {
	identity: number;
	moniker: string;
};

export type CommissionRates = {
	rate: string;
};

export type Commission = {
	commission_rates: CommissionRates;
};

export type Balance = {
	amount: any;
	denom: string;
};

export type Delegation = {
	balance: Balance;
	validator_address: string;
};

export type Validator = {
	commission: Commission;
	delegations?: Delegation[];
	delegator_shares: string;
	description: ValidatorDescription;
	key: string;
	jailed: boolean;
	name: string;
	operator_address: string;
	status: number;
	tokens: string;
	type: string;
	unbonding_height: string;
	unbonding_time: string;
	value: string;
};
