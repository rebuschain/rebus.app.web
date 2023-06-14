export type TokenPair = {
	erc20_address: string;
	denom: string;
	enabled: boolean;
	contract_owner: string;
};

export type TokenPairPagination = {
	next_key: string;
	total: string;
};

export type TokenPairsResponse = {
	token_pairs: TokenPair[];
	pagination: TokenPairPagination;
};
