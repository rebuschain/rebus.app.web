import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenterSelf } from 'src/components/layouts/containers';
import { ROUTES } from 'src/constants/routes';
import { useStore } from 'src/stores';
import { AssetBalancesList } from './asset-balances-list';
import { AssetsOverview } from './assets-overview';
import { IbcTransferHistoryList } from './ibc-transfer-history-list';

const AssetsPage: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const navigate = useNavigate();
	const { ibcTransferHistoryStore, chainStore, accountStore, walletStore, featureFlagStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	useEffect(() => {
		(async () => {
			await featureFlagStore.waitResponse();

			if (!featureFlagStore.featureFlags.assetsPage) {
				navigate(ROUTES.STAKE);
			}
		})();
	}, [featureFlagStore, navigate]);

	if (!featureFlagStore.response) {
		return null;
	}

	return (
		<AssetsPageContainer>
			<AssetsOverviewSection>
				<CenterSelf>
					<AssetsOverview title="My Assets" />
				</CenterSelf>
			</AssetsOverviewSection>

			<BalanceAndHistorySection>
				<CenterSelf>
					<AssetBalancesList />
					{ibcTransferHistoryStore.getHistoriesAndUncommitedHistoriesByAccount(address).length > 0 ? (
						<IbcTransferHistoryList />
					) : null}
				</CenterSelf>
			</BalanceAndHistorySection>
		</AssetsPageContainer>
	);
});

const AssetsPageContainer = styled.div`
	width: 100%;
	height: fit-content;
`;

const AssetsOverviewSection = styled.div`
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

const BalanceAndHistorySection = styled.div`
	padding: 20px 0;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

export default AssetsPage;
