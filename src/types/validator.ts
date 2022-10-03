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
	name: string;
	operator_address: string;
	status: number;
	tokens: number;
	type: string;
	value: string;
};
