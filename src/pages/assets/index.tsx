import styled, { ThemeProvider } from 'styled-components';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CenterSelf } from 'src/components/layouts/containers';
import { ROUTES } from 'src/constants/routes';
import { useStore } from 'src/stores';
import SnackbarMessage from 'src/components/insync/snackbar-message';
import { AssetBalancesList } from './asset-balances-list';
import { AssetsOverview } from './assets-overview';
import { IbcTransferHistoryList } from './ibc-transfer-history-list';

/* Import statement and neat way to test buttons
import { Button } from 'src/components/common/button';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px' }}>
	<Button backgroundStyle={'primary'} disabled={false}>
		Placeholder
	</Button>
	<Button backgroundStyle={'primary'} disabled={true}>
		Placeholder
	</Button>
	<Button backgroundStyle={'secondary'} disabled={false}>
		Placeholder
	</Button>
	<Button backgroundStyle={'secondary'} disabled={true}>
		Placeholder
	</Button>
	<Button backgroundStyle={'ghost'} disabled={false}>
		Placeholder
	</Button>
	<Button backgroundStyle={'ghost'} disabled={true}>
		Placeholder
	</Button>
</div>
/*
Import statements needed to test TextField component:
import TextField from 'src/components/insync/text-field/textField';

Place inside return below to test Textfields:
<TextField label="Label" assistiveText="Assistive Text" disabled={false} error={false} errorMessage="" />
<TextField label="Label" assistiveText="Assistive Text" disabled={true} error={false} errorMessage="" />
<TextField
	label="Label"
	assistiveText="Assistive Text"
	disabled={false}
	error={true}
	errorMessage="Invalid password"
/>
*/

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
			<SnackbarMessage />

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
