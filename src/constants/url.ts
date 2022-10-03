import { config } from 'src/config-insync';

export const REST_URL = config.REST_URL;
export const RPC_URL = config.RPC_URL;

export const urlFetchDelegations = (address: string) => `${REST_URL}/staking/delegators/${address}/delegations`;
export const urlFetchBalance = (address: string) => `${REST_URL}/bank/balances/${address}`;
export const urlFetchVestingBalance = (address: string) => `${REST_URL}/auth/accounts/${address}`;
export const urlFetchUnBondingDelegations = (address: string) =>
	`${REST_URL}/staking/delegators/${address}/unbonding_delegations`;

export const urlFetchRewards = (address: string) => `${REST_URL}/distribution/delegators/${address}/rewards`;
export const urlFetchVoteDetails = (proposalId: string | number, address: string) =>
	`${REST_URL}/gov/proposals/${proposalId}/votes/${address}`;

export const VALIDATORS_LIST_URL = `${REST_URL}/staking/validators`;
export const getValidatorURL = (address: string) => `${REST_URL}/staking/validators/${address}`;
export const PROPOSALS_LIST_URL = `${REST_URL}/gov/proposals`;
export const getDelegatedValidatorsURL = (address: string) => `${REST_URL}/staking/delegators/${address}/validators`;
export const urlFetchProposalVotes = (id: string | number) => `${REST_URL}/gov/proposals/${id}/votes`;
export const urlFetchTallyDetails = (id: string | number) => `${REST_URL}/gov/proposals/${id}/tally`;
export const urlFetchProposalDetails = (id: string | number) =>
	`${REST_URL}/txs?message.module=governance&submit_proposal.proposal_id=${id}`;

export const validatorImageURL = (id: string | number) =>
	`https://keybase.io/_/api/1.0/user/lookup.json?fields=pictures&key_suffix=${id}`;
