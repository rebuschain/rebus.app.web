import React from 'react';
import { useHistory } from 'react-router-dom';
import { PoolCardListGridContainer } from 'src/components/layouts/containers';
import { PoolCardItem } from 'src/pages/pools/components/pool-card-list/pool-card-item';
import { isMyPoolCardProp } from 'src/pages/pools/components/pool-card-list/utils/is-my-pool-card-prop';
import { IncentivizedPoolCardProp, MyPoolCardProp } from 'src/pages/pools/models/pool-card-props';

interface Props {
	poolList: Array<IncentivizedPoolCardProp | MyPoolCardProp>;
}

export function PoolCardList({ poolList }: Props) {
	const history = useHistory();
	return (
		<PoolCardListGridContainer>
			{poolList.map(pool => {
				return (
					<PoolCardItem
						onClick={e => {
							e.preventDefault();
							history.push(`/pool/${pool.poolId}`);
						}}
						key={pool.poolId}
						poolId={pool.poolId}
						apr={pool.apr}
						liquidity={pool.liquidity}
						tokens={pool.tokens}
						myLiquidity={isMyPoolCardProp(pool) ? pool.myLiquidity : undefined}
						myLockedAmount={isMyPoolCardProp(pool) ? pool.myLockedAmount : undefined}
					/>
				);
			})}
		</PoolCardListGridContainer>
	);
}
