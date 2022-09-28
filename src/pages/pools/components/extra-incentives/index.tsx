import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { FullWidthContainer } from 'src/components/layouts/containers';
import { TitleText } from 'src/components/texts';
import { PoolCardList } from './pools';
import { useFilteredExtraIncentivePools } from 'src/pages/pools/components/extra-incentives/hook';

export const ExtraIncentivizedPools: FunctionComponent = observer(() => {
	const incentivizedPoolInfoList = useFilteredExtraIncentivePools();

	return (
		<FullWidthContainer>
			<TitleText>External Incentive Pools</TitleText>

			{incentivizedPoolInfoList.length !== 0 ? <PoolCardList poolList={incentivizedPoolInfoList} /> : null}
		</FullWidthContainer>
	);
});
