import { observer } from 'mobx-react-lite';
import React from 'react';
import { FullWidthContainer } from 'src/components/layouts/Containers';
import { TitleText } from 'src/components/Texts';
import { PoolCardList } from 'src/pages/pools/components/PoolCardList';
import { MyPoolCardProp } from 'src/pages/pools/models/poolCardProps';
import { useStore } from 'src/stores';
import { LockupAbledPoolIds } from 'src/config';

export const MyPools = observer(function MyPools() {
	const { chainStore, accountStore, queriesStore, priceStore, walletStore } = useStore();

	const queries = queriesStore.get(chainStore.currentOsmosis.chainId);
	const account = accountStore.getAccount(chainStore.currentOsmosis.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const queryIncentivizedPools = queries.rebus.queryIncentivizedPools;
	const myPools = queries.rebus.queryGammPoolShare.getOwnPools(address);

	const myPoolInfoList = myPools
		.map(poolId => {
			// 이 카드는 보통 All Pools 카드와 함께 있다.
			// 따로 하나씩 pool을 쿼리하지 않고 All Pools의 페이지네이션 쿼리와 공유한다.
			const pool = queries.rebus.queryGammPools.getPoolFromPagination(poolId);
			if (!pool) {
				return undefined;
			}

			const tvl = pool.computeTotalValueLocked(priceStore, priceStore.getFiatCurrency('usd')!);
			const shareRatio = queries.rebus.queryGammPoolShare.getAllGammShareRatio(address, pool.id);
			const actualShareRatio = shareRatio.increasePrecision(2);

			const lockedShareRatio = queries.rebus.queryGammPoolShare.getLockedGammShareRatio(address, pool.id);
			const actualLockedShareRatio = lockedShareRatio.increasePrecision(2);

			// 데이터 구조를 바꿀 필요가 있다.
			return {
				poolId: pool.id,
				apr: {
					value: queryIncentivizedPools.isIncentivized(pool.id)
						? queryIncentivizedPools.computeMostAPY(pool.id, priceStore, priceStore.getFiatCurrency('usd')!).toString()
						: undefined,
					isLoading: queryIncentivizedPools.isAprFetching,
				},
				liquidity: {
					value: pool.computeTotalValueLocked(priceStore, priceStore.getFiatCurrency('usd')!).toString(),
				},
				myLiquidity: {
					value: tvl.mul(actualShareRatio).toString(),
					isLoading: queries.rebus.queryGammPoolShare.isFetchingShareRatio,
				},
				myLockedAmount: {
					value:
						queryIncentivizedPools.isIncentivized(pool.id) || LockupAbledPoolIds[pool.id]
							? tvl.mul(actualLockedShareRatio).toString()
							: undefined,
					isLoading: queries.rebus.queryGammPoolShare.isFetchingLockedShareRatio,
				},
				tokens: pool.poolAssets.map(asset => asset.amount.currency),
			} as MyPoolCardProp;
		})
		.filter((d): d is MyPoolCardProp => d != null);

	return (
		<FullWidthContainer>
			<TitleText>My Pools</TitleText>
			<PoolCardList poolList={myPoolInfoList} />
		</FullWidthContainer>
	);
});
