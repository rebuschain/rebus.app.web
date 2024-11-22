import styled from 'styled-components';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { FullScreenContainer } from 'src/components/layouts/containers';
import { Button } from 'src/components/common/button';
import SnackbarMessage from '../../components/insync/snackbar-message';
import { METAMASK_WALLET_CONFIG, MetamaskStep } from './metamask-step';
import { KEPLR_WALLET_CONFIG, KeplrStep } from './keplr-step';
import { MigrationStep } from './migration-step';
import * as extraActions from 'src/reducers/extra-actions';
import { useStore } from 'src/stores';
import { WalletConfig } from 'src/constants/wallet';
import { CoinPretty } from '@keplr-wallet/unit';
import { observer } from 'mobx-react-lite';
import { useActions } from 'src/hooks/use-actions';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import env from '@beam-australia/react-env';

const BackgroundStyle = styled.div`
	background-color: ${props => props.theme.gray.lightest};
	border-radius: 20px;
	color: ${props => props.theme.text};
	margin-bottom: 32px;
	max-width: 80%;
`;

const ConnectedWalletEntry = ({
	address,
	accountName,
	balance,
	wallet,
}: {
	address: string;
	accountName: string;
	balance: CoinPretty;
	wallet: WalletConfig;
}) => {
	const { chainStore, accountStore } = useStore();

	const account = accountStore.getAccount(chainStore.current.chainId);
	const [disconnect] = useActions([extraActions.disconnect]);
	const { disconnectAccount } = useAccountConnection();

	return (
		<BackgroundStyle>
			<div className="p-4.5 md:pt-4.5 font-body flex flex-col mx-auto" style={{ maxWidth: '100%' }}>
				<div className="flex justify-between">
					<h3 className={classNames('text-lg font-semibold mb-2')}>{wallet.name} connected</h3>
					<Button
						backgroundStyle="primary"
						onClick={e => {
							e.preventDefault();

							if (wallet.walletType === 'metamask') {
								disconnect();
								disconnectAccount();
							} else {
								account.disconnect();
							}
						}}
						style={{
							marginBottom: '8px',
							width: '160px',
						}}>
						Disconnect
					</Button>
				</div>
				{accountName && (
					<div>
						Account Name: <b>{accountName}</b>
					</div>
				)}
				<div className="break-words">
					Address: <b>{address}</b>
				</div>
				<div>
					Balance:{' '}
					<b>
						{balance
							.trim(true)
							.maxDecimals(2)
							.shrink(true)
							.upperCase(true)
							.toString()}
					</b>
				</div>
			</div>
		</BackgroundStyle>
	);
};

const MigrationPage: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const navigate = useNavigate();
	const { chainStore, accountStore, queriesStore, walletStore } = useStore();
	const [skippedKeplr, setSkippedKeplr] = useState(false);

	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const isKeplrConnected = !!account.bech32Address;

	const metamaskBalance = queries.queryBalances.getQueryBech32Address(walletStore.rebusAddress).stakable.balance;
	const keplrBalance = queries.queryBalances.getQueryBech32Address(account.bech32Address).stakable.balance;

	useEffect(() => {
		if (!env('L1_MIGRATION_CONTRACT_ADDRESS')) {
			navigate('/');
		}
	}, [navigate]);

	// If keplr is connected and metamask is not, disconnect keplr
	useEffect(() => {
		if (!walletStore.isLoaded && (skippedKeplr || isKeplrConnected)) {
			account.disconnect();
			setSkippedKeplr(false);
		}
	}, [account, walletStore.isLoaded, isKeplrConnected, skippedKeplr]);

	return (
		<FullScreenContainerWithPadding>
			<h1 className="text-lg font-semibold" style={{ marginBottom: '32px' }}>
				Layer1 to Layer2 Migration
			</h1>

			{walletStore.isLoaded && (
				<ConnectedWalletEntry
					accountName={walletStore.accountName}
					address={walletStore.address}
					balance={metamaskBalance}
					wallet={METAMASK_WALLET_CONFIG}
				/>
			)}
			{(isKeplrConnected || skippedKeplr) && walletStore.isLoaded && (
				<ConnectedWalletEntry
					accountName={account.name}
					address={account.bech32Address}
					balance={keplrBalance}
					wallet={KEPLR_WALLET_CONFIG}
				/>
			)}

			{!walletStore.isLoaded && <MetamaskStep />}
			{walletStore.isLoaded && !account.bech32Address && <KeplrStep onSkip={() => setSkippedKeplr(true)} />}
			{walletStore.isLoaded && <MigrationStep />}
			<SnackbarMessage />
		</FullScreenContainerWithPadding>
	);
});

const FullScreenContainerWithPadding = styled(FullScreenContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

export default MigrationPage;
