import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { CenterSection } from 'src/components/layouts/Containers';
import { IncentivizedPools } from 'src/pages/pools/components/IncentivizedPools';
import { MyPools } from 'src/pages/pools/components/MyPools';
import { AllPools } from './components/AllPools';
import { LabsOverview } from './components/LabsOverview';
import { ExtraIncentivizedPools } from 'src/pages/pools/components/ExtraIncentives';
import { useFilteredExtraIncentivePools } from 'src/pages/pools/components/ExtraIncentives/hook';

const PoolsPage = observer(function PoolsPage() {
	const extraIncentivePools = useFilteredExtraIncentivePools();

	return (
		<PageContainer>
			<OverviewSection>
				<LabsOverview />
			</OverviewSection>

			<MyPoolsSection>
				<MyPools />
			</MyPoolsSection>

			<IncentivizedPoolsSection>
				<IncentivizedPools />
			</IncentivizedPoolsSection>

			{extraIncentivePools.length > 0 ? (
				<IncentivizedPoolsSection>
					<ExtraIncentivizedPools />
				</IncentivizedPoolsSection>
			) : null}

			<AllPoolsSection>
				<AllPools />
			</AllPoolsSection>
		</PageContainer>
	);
});

const PageContainer = styled.div`
	width: 100%;
	height: fit-content;
`;

const OverviewSection = styled(CenterSection)`
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px;
	}
`;

const MyPoolsSection = styled(CenterSection)`
	background-color: rgb(28, 23, 60, 0.6);
	padding: 24px 20px;

	@media (min-width: 768px) {
		padding: 40px;
	}
`;

const IncentivizedPoolsSection = styled(CenterSection)`
	padding: 24px 20px;

	@media (min-width: 768px) {
		padding: 40px;
`;

const AllPoolsSection = styled(CenterSection)`
	padding: 24px 0;

	@media (min-width: 768px) {
		padding: 40px;
`;

export default PoolsPage;
