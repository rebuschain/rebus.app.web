import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { useStore } from 'src/stores';
import SnackbarMessage from 'src/components/insync/snackbar-message';
import { AssetBalancesList } from './asset-balances-list';
import { AssetsOverview } from './assets-overview';
import { IbcTransferHistoryList } from './ibc-transfer-history-list';
import { hexToRgb } from 'src/colors';

const AssetsPage: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const { ibcTransferHistoryStore, chainStore, accountStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	return (
		<AssetsPageContainer>
			<SnackbarMessage />

			<AssetsOverviewSection>
				<AssetsOverview title="My Assets" />
			</AssetsOverviewSection>

			<BalanceAndHistorySection>
				<AssetBalancesList />
				{ibcTransferHistoryStore.getHistoriesAndUncommitedHistoriesByAccount(address).length > 0 ? (
					<IbcTransferHistoryList />
				) : null}
			</BalanceAndHistorySection>
		</AssetsPageContainer>
	);
});

const AssetsPageContainer = styled.div`
	background: ${props => props.theme.background};
	width: 100%;
	height: fit-content;
`;

const AssetsOverviewSection = styled.div`
	padding-bottom: 24px;
	margin-right: 20px;

	@media (min-width: 768px) {
		padding-top: 40px;
	}
`;

const BalanceAndHistorySection = styled.div`
	padding: 20px 0;
	border: 1px solid ${props => hexToRgb(props.theme.text, 0.1)};
	border-radius: 24px;
	margin-right: 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

export default AssetsPage;
