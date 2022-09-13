import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Loader } from 'src/components/common/Loader';
import { CenterSelf } from 'src/components/layouts/Containers';
import { useStore } from 'src/stores';
import { AirdropMissions } from './AirdropMissions';
import { AirdropOverview } from './AirdropOverview';
import { MyAirdropProgress } from './MyAirdropProgress';

const LoaderStyled = styled(Loader)`
	width: 6rem;
	height: 6rem;
	@media (min-width: 768px) {
		width: 12.5rem;
		height: 12.5rem;
	}
`;

const AirdropPage: FunctionComponent = observer(function AirdropPage() {
	const history = useHistory();
	const { chainStore, queriesStore } = useStore();

	const queries = queriesStore.get(chainStore.current.chainId);

	const error = queries.rebus.queryClaimParams.error;
	const { claimEnabled, hasResponse } = queries.rebus.queryClaimParams;

	useEffect(() => {
		if ((hasResponse || error) && !claimEnabled) {
			history.push('/');
		}
	}, [claimEnabled, history, hasResponse, error]);

	if (!claimEnabled) {
		return <LoaderStyled />;
	}

	return (
		<AirdropPageContainer>
			<AirdropOverviewSection>
				<CenterSelf>
					<AirdropOverview />
				</CenterSelf>
			</AirdropOverviewSection>

			<ProgressSection>
				<CenterSelf>
					<MyAirdropProgress />
					<AirdropMissions />
				</CenterSelf>
			</ProgressSection>
		</AirdropPageContainer>
	);
});

const AirdropPageContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const AirdropOverviewSection = styled.div`
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

const ProgressSection = styled.div`
	padding: 20px;

	@media (min-width: 768px) {
		padding: 50px 60px;
	}
`;

export default AirdropPage;
