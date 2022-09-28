import React from 'react';
import { observer } from 'mobx-react-lite';
import { CoinPretty } from '@keplr-wallet/unit';
import { useAmountConfig } from '@keplr-wallet/hooks';
import { useStore } from 'src/stores';
import variables from 'src/utils/variables';
import totalTokens from 'src/assets/user-details/available-tokens.svg';
import stakedTokens from 'src/assets/user-details/staked-tokens.svg';
import unStake from 'src/assets/user-details/unstaked-tokens.svg';
import rewardsIcon from 'src/assets/user-details/rewards.svg';
import DotsLoading from 'src/components/insync/dots-loading';
import StakeTokensButton from './stake-tokens-button';
import UnDelegateButton from './un-delegate-button';
import ReDelegateButton from './re-delegate-button';
import ClaimButton from './claim-button';
import './index.scss';

type TokenDetailsProps = {
	lang: string;
};

const TokenDetails = observer<TokenDetailsProps>(props => {
	const { chainStore, accountStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const amountConfig = useAmountConfig(chainStore, chainStore.current.chainId, address, queries.queryBalances);

	const langVariables = (variables as any)[props.lang] as { [key: string]: string };

	const balanceQuery = queries.queryBalances.getQueryBech32Address(address);
	const available = balanceQuery.stakable.balance
		.hideDenom(true)
		.maxDecimals(2)
		.toString();
	const balanceInProgress = balanceQuery.stakable.isFetching;

	const delegationsQuery = queries.cosmos.queryDelegations.getQueryBech32Address(address);
	const staked = delegationsQuery.total
		.hideDenom(true)
		.maxDecimals(2)
		.toString();
	const stakedInProgress = delegationsQuery.isFetching;

	const rewardsQuery = queries.cosmos.queryRewards.getQueryBech32Address(address);
	const rewards = rewardsQuery.rewards
		.reduce((acc, amount) => acc.add(amount), new CoinPretty(amountConfig.sendCurrency, 0))
		.hideDenom(true)
		.maxDecimals(2)
		.toString();
	const rewardsInProgress = rewardsQuery.isFetching;

	const unBondingDelegationsQuery = queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(address);
	const unstaked = unBondingDelegationsQuery.total
		.hideDenom(true)
		.maxDecimals(2)
		.toString();
	const unstakedInProgress = unBondingDelegationsQuery.isFetching;

	return (
		<div className="token_details">
			<div className="chip_info">
				<p>{langVariables['available_tokens']}</p>
				<div className="chip">
					<img alt="available tokens" src={totalTokens} />
					{balanceInProgress ? <DotsLoading /> : <p>{available}</p>}
				</div>
				<StakeTokensButton />
			</div>
			<div className="chip_info">
				<p>{langVariables['staked_tokens']}</p>
				<div className="chip">
					<img alt="total tokens" src={stakedTokens} />
					{stakedInProgress ? <DotsLoading /> : <p>{staked}</p>}
				</div>
				<div className="buttons_div">
					<UnDelegateButton />
					<span />
					<ReDelegateButton />
				</div>
			</div>
			<div className="chip_info">
				<p>{langVariables.rewards}</p>
				<div className="chip">
					<img alt="total tokens" src={rewardsIcon} />
					{rewardsInProgress ? <DotsLoading /> : <p>{rewards}</p>}
				</div>
				<div className="buttons_div">
					<ClaimButton disable={parseFloat(rewards) <= 0} />
				</div>
			</div>
			<div className="chip_info">
				<p>{langVariables['un_staked_tokens']}</p>
				<div className="chip">
					<img alt="unstaked tokens" src={unStake} />
					{unstakedInProgress ? <DotsLoading /> : <p>{unstaked}</p>}
				</div>
			</div>
		</div>
	);
});

export default TokenDetails;
