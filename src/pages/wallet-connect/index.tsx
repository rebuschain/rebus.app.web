import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile as checkIsMobile } from '@walletconnect/browser-utils';
import axios from 'axios';
import env from '@beam-australia/react-env';
import { FullScreenContainer } from 'src/components/layouts/containers';
import { WALLET_LIST } from 'src/constants/wallet';
import { useStore } from 'src/stores';
import { KeyConnectingWalletType, KeyConnectingWalletName, KeyAutoConnectingWalletType } from 'src/dialogs';
import { Button } from 'src/components/common/button';
import { Text } from 'src/components/texts';
import { useActions } from 'src/hooks/use-actions';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import { snackbarActions } from 'src/reducers/slices';
import { disconnect } from 'src/reducers/extra-actions';
import SnackbarMessage from '../../components/insync/snackbar-message';
import { config } from '../../config-insync';
import { styled, useTheme } from 'styled-components';

const chainId = config.CHAIN_ID;

const headers = {
	'Content-Type': 'application/json',
};
const baseUrls = {
	dropmint: env('DISCORD_BOT_URL'),
};

const signKeplr = async (address: string, nonce: number, userId: string) => {
	(await window.keplr) && window.keplr?.enable(chainId);

	return window.keplr?.signArbitrary(
		chainId,
		address,
		JSON.stringify({
			address,
			nonce,
			userId,
		})
	);
};

const WalletConnect: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const { search } = useLocation();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(search);
	const app = searchParams.get('app') as string;
	const redirectUrl = searchParams.get('redirectUrl');
	const serverId = searchParams.get('serverId');
	const userId = searchParams.get('userId') as string;

	const [success, setSuccess] = useState(false);

	const [disconnectSet, showMessage] = useActions([disconnect, snackbarActions.showSnackbar]);

	const { connectWalletManager, chainStore, accountStore, walletStore, setIsEvmos } = useStore();
	const [isMobile] = useState(() => checkIsMobile());
	const { isAccountConnected, disconnectAccount, isMobileWeb } = useAccountConnection();
	const isConnected = isAccountConnected || walletStore.isLoaded;
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const theme = useTheme();

	useEffect(() => {
		if (!serverId || !userId) {
			navigate('/');
		}
	}, [navigate, serverId, userId]);

	useEffect(() => {
		// Skip the selection of wallet type if mobile
		const wallet = WALLET_LIST.find(({ type }) => type === 'wallet-connect');

		if (isMobile && !isConnected && wallet) {
			localStorage.setItem(KeyConnectingWalletType, wallet.type);
			localStorage.removeItem(KeyConnectingWalletName);
			connectWalletManager.setWalletName('');
			setIsEvmos(chainStore.current.chainId, false);
			account.init();
		}
	}, [account, accountStore, chainStore, connectWalletManager, isConnected, isMobile, setIsEvmos]);

	const onConfirm = useCallback(async () => {
		setLoading(true);

		try {
			const baseUrl = (baseUrls as any)[app];
			if (!baseUrl) {
				return showMessage(`Invalid app: ${app}`);
			}

			// For wallets like metamask we want to use the eth address starting with 0x
			const addressToUse = walletStore.isLoaded ? walletStore.address : account.bech32Address;
			const { data } = await axios.post(`${baseUrl}/api/v1/nonce`, { address: addressToUse }, { headers });
			const nonce = data?.nonce;

			if (!nonce) {
				return showMessage('Error generating nonce');
			}

			let signature = '';
			let pubKey = '';

			if (walletStore.isLoaded) {
				signature = await walletStore.signMessage(
					JSON.stringify({
						address: addressToUse,
						nonce,
						userId,
					})
				);

				if (!signature) {
					setLoading(false);
					return showMessage('Error generating signature');
				}
			} else {
				const sigRes = await signKeplr(addressToUse, nonce, userId);
				pubKey = sigRes?.pub_key?.value as string;
				signature = sigRes?.signature as string;
			}

			const authorizeRes = await axios.post(
				`${baseUrl}/api/v1/authorize`,
				{
					address: addressToUse,
					nonce,
					signature,
					userId,
					pubKey,
					serverId,
					chainPrefix: env('PREFIX'),
				},
				{ headers }
			);

			if (!authorizeRes.data?.success) {
				setLoading(false);
				return showMessage('Error verifying signature');
			}

			setSuccess(true);
		} catch (err) {
			showMessage((err as any).response?.data?.message || (err as any).message);
		}

		setLoading(false);
	}, [app, walletStore, account.bech32Address, userId, serverId, showMessage]);

	let content = null;

	if (success) {
		content = (
			<>
				<h5 className="text-base md:text-lg mb-1 mb-5">Successfully linked user to wallet</h5>
				{redirectUrl && (
					<Button
						backgroundStyle="primary"
						onClick={e => {
							e.preventDefault();
							window.open(redirectUrl);
						}}>
						<Text emphasis="high" weight="semiBold">
							Back to Discord
						</Text>
					</Button>
				)}
			</>
		);
	} else if (isConnected) {
		const connectingWalletType =
			localStorage?.getItem(KeyAutoConnectingWalletType) || localStorage?.getItem(KeyConnectingWalletType);
		const connectingWalletName = localStorage.getItem(KeyConnectingWalletName);
		const walletConnected =
			WALLET_LIST.find(({ walletType }) => connectingWalletName === walletType) ||
			WALLET_LIST.find(({ type }) => type === connectingWalletType);

		content = (
			<>
				<div className="text-left p-3 md:p-5 rounded-2xl flex items-center">
					<img src={walletConnected?.logoUrl} className="w-12 mr-3 md:w-16 md:mr-5" />
					<ContentStyled>
						<h5 className="text-base md:text-lg mb-1">{walletConnected?.name}</h5>
						<p className="text-xs md:text-sm text-iconDefault">{walletConnected?.description}</p>
					</ContentStyled>
				</div>
				<div className="flex mt-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button
						disabled={loading}
						onClick={e => {
							e.preventDefault();
							onConfirm();
						}}>
						<Text emphasis="high" weight="semiBold">
							Confirm Wallet
						</Text>
					</Button>

					{!isMobileWeb ? (
						<div className="ml-4">
							<Button
								backgroundStyle="primary"
								onClick={e => {
									e.preventDefault();
									disconnectAccount();
									disconnectSet();
								}}>
								<Text emphasis="high" weight="semiBold">
									Choose Another Wallet
								</Text>
							</Button>
						</div>
					) : null}
				</div>
			</>
		);
	} else if (!WALLET_LIST.length) {
		content = (
			<>
				<h4 className="text-lg md:text-xl">Connect Wallet</h4>
				<p className="text-xs md:text-sm mt-4">
					This browser does not support any wallet extensions, please use either Chrome or Firefox.
				</p>
			</>
		);
	} else {
		content = (
			<>
				<h4 className="text-lg md:text-xl">Connect Wallet</h4>
				<h5 className="text-base mt-2">Choose your wallet to connect with the Discord bot integration</h5>
				{WALLET_LIST.filter(wallet => {
					if (isMobile && wallet.type == 'extension') {
						return false;
					}
					return true;
				}).map(wallet => (
					<Button
						key={wallet.name}
						backgroundStyle="secondary"
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							height: 'auto',
							marginBottom: '10px',
							marginTop: '10px',
						}}
						onClick={async () => {
							localStorage.setItem(KeyConnectingWalletType, wallet.type);
							localStorage.setItem(KeyConnectingWalletName, wallet.walletType || '');
							connectWalletManager.setWalletName(wallet.walletType || '');

							if (!wallet.walletType?.includes('keplr')) {
								try {
									const success = await walletStore.init(wallet.walletType, true);
									localStorage.setItem(KeyAutoConnectingWalletType, success ? 'extension' : '');
								} catch (err) {
									showMessage((err as any)?.message || err);
								}
							} else {
								setIsEvmos(chainStore.current.chainId, wallet.walletType === 'keplr-evmos');
								account.init();
							}
						}}>
						<img
							src={wallet.logoUrl}
							className="w-12 mr-3 md:w-16 md:mr-5"
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
							}}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								textAlign: 'left',
								color: theme.text,
							}}>
							<h5 className="text-base md:text-lg mb-1">{wallet.name}</h5>
							<p className="text-xs md:text-sm">{wallet.description}</p>
						</div>
					</Button>
				))}
			</>
		);
	}

	return (
		<FullScreenContainer>
			<div className="flex items-center justify-center h-full pt-20 md:pt-0">
				<ContentStyled className="relative w-full mt-4 md:mt-0 mx-10 md:mx-0 md:min-w-modal md:max-w-modal px-4 py-5 md:p-8 shadow-elevation-24dp rounded-2xl z-10">
					{content}
				</ContentStyled>
			</div>
			<SnackbarMessage />
		</FullScreenContainer>
	);
});

export default WalletConnect;

const ContentStyled = styled.div`
	background: ${props => props.theme.background};
	color: ${props => props.theme.text};
`;
