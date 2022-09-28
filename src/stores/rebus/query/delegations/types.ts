type Delegation = {
	delegator_address: string;
	validator_address: string;
	shares: string;
};

type Balance = {
	denom: string;
	amount: string;
};

type DelegationResult = {
	delegation: Delegation;
	balance: Balance;
};

export type Delegations = {
	height: string;
	result: DelegationResult[];
};
