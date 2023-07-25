export type SpendableBalance = {
	denom: string;
	amount: string;
};

export type Pagination = {
	next_key: string | null;
	total: string;
};

export type SpendableBalanceResponse = {
	balances: SpendableBalance[];
	pagination: Pagination;
};
