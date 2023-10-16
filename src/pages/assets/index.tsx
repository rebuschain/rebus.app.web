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
import { hexToRgb } from 'src/colors';

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

Import statements needed to test Tab component:
import TabBar from 'src/components/common/tab-bar';

<TabBar tabs={['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6']} />
Import statement and neat way to test modal
import Modal from 'src/components/common/modal';
import { Button } from 'src/components/common/button';

const textFields = [
		{
			label: 'Label',
			assistiveText: 'Assistive Text',
			disabled: false,
			error: false,
			errorMessage: '',
		},
	];

const checkboxes = [{ label: 'Placeholder' }, { label: 'Placeholder' }];

const [isVisible, setVisible] = useState(false);

const handleOpenModal = () => {
	setVisible(true);
};

const handleCloseModal = () => {
	setVisible(false);
};

const handleConfirm = () => {
	//This is where to handle a saved modal change
	handleCloseModal();
};

<div>
	<Button backgroundStyle={'primary'} onClick={handleOpenModal}>
		Open Modal
	</Button>
	{isVisible && (
		<Modal
			title="Title"
			subtitle="Label"
			textfields={textFields}
			checkboxes={checkboxes}
			onClose={handleCloseModal}
			onConfirm={handleConfirm}
		/>
	)}
</div>

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
