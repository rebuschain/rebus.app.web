import React, { FunctionComponent } from 'react';
import { CoinPretty } from '@keplr-wallet/unit';
import { useAmountConfig } from '@keplr-wallet/hooks';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores';
import variables from '../../../utils/variables';
import totalTokens from '../../../assets/userDetails/available-tokens.svg';
import stakedTokens from '../../../assets/userDetails/staked-tokens.svg';
import unStake from '../../../assets/userDetails/unstaked-tokens.svg';
import rewardsIcon from '../../../assets/userDetails/rewards.svg';
import DotsLoading from '../../../components/insync/DotsLoading';
import StakeTokensButton from './StakeTokensButton';
import UnDelegateButton from './UnDelegateButton';
import ReDelegateButton from './ReDelegateButton';
import ClaimButton from './ClaimButton';
import './index.scss';

type TokenDetailsProps = {
	lang: string;
};

const TokenDetails: FunctionComponent<TokenDetailsProps> = observer(props => {
	const { chainStore, accountStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);

	const amountConfig = useAmountConfig(
		chainStore,
		chainStore.current.chainId,
		account.bech32Address,
		queries.queryBalances
	);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

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
