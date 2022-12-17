import React from 'react';
import { observer } from 'mobx-react-lite';
import { CoinPretty } from '@keplr-wallet/unit';
import { useAmountConfig } from '@keplr-wallet/hooks';
import styled from '@emotion/styled';
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
		<div className="flex flex-1 flex-wrap flex-col items-center justify-center md:flex-row md:items-start md:justify-start">
			<ChipInfo>
				<Label>{langVariables['available_tokens']}</Label>
				<Chip>
					<Icon alt="available tokens" src={totalTokens} />
					{balanceInProgress ? <DotsLoading /> : <Value>{available}</Value>}
				</Chip>
				<StakeTokensButton />
			</ChipInfo>
			<ChipInfo>
				<Label>{langVariables['staked_tokens']}</Label>
				<Chip>
					<Icon alt="total tokens" src={stakedTokens} />
					{stakedInProgress ? <DotsLoading /> : <Value>{staked}</Value>}
				</Chip>
				<div className="flex items-center justify-center">
					<UnDelegateButton />
					<Divider />
					<ReDelegateButton />
				</div>
			</ChipInfo>
			<ChipInfo>
				<Label>{langVariables.rewards}</Label>
				<Chip>
					<Icon alt="total tokens" src={rewardsIcon} />
					{rewardsInProgress ? <DotsLoading /> : <Value>{rewards}</Value>}
				</Chip>
				<div className="flex items-center justify-center">
					<ClaimButton disable={parseFloat(rewards) <= 0} />
				</div>
			</ChipInfo>
			<ChipInfo>
				<Label>{langVariables['un_staked_tokens']}</Label>
				<Chip>
					<Icon alt="unstaked tokens" src={unStake} />
					{unstakedInProgress ? <DotsLoading /> : <Value>{unstaked}</Value>}
				</Chip>
			</ChipInfo>
		</div>
	);
});

const Chip = styled.div`
	border-radius: 50px;
	display: flex;
	align-items: center;
	padding: 10px 0;
	margin: 10px 0;
`;

const ChipInfo = styled.div`
	margin-right: 40px;
	text-align: center;

	@media (max-width: 769px) {
		margin: 0 0 20px;
		width: 100%;
	}
`;

const Icon = styled.img`
	background: linear-gradient(104.04deg, #f1f0f6 0%, #dddbe9 100%);
	border-radius: 30px;
	height: 50px;
	padding: 1px;
	margin-right: 20px;
	max-width: 50px;
`;

const Label = styled.p`
	color: rgba(255, 255, 255, 0.6);
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 16px;
	width: max-content;
`;

const Value = styled.p`
	font-family: Inter, ui-sans-serif, system-ui;
	font-size: 30px;
	color: #fff;
	width: max-content;
`;

const Divider = styled.div`
	height: 20px;
	border: 0.5px solid #ffffff;
	margin: 0 10px;
`;

export default TokenDetails;
