import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect } from 'react';
import env from '@beam-australia/react-env';
import { Button } from 'src/components/common/button';
import { useActions } from 'src/hooks/use-actions';
import { LINKS } from 'src/constants/links';
import { MISC } from 'src/constants';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import { useStore } from 'src/stores';
import * as extraActions from 'src/reducers/extra-actions';
import { ConnectAccountButton } from '../../connect-account-button';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import { darkTheme } from 'src/theme';

export const SidebarBottom: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const [disconnect] = useActions([extraActions.disconnect]);

	const { chainStore, accountStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const name = walletStore.isLoaded ? walletStore.accountName : account.name;
	const version = walletStore.isLoaded ? walletStore.version : account.rebus.version;
	const theme = useTheme();
	const isDark = theme === darkTheme;

	let network = env('CHAIN_NAME');

	if (!walletStore.isLoaded && account.rebus.isEvmos) {
		network += ' (EVM)';
	}

	if (version) {
		network += ` v${version}`;
	}

	const { isAccountConnected, connectAccount, disconnectAccount, isMobileWeb } = useAccountConnection();
	useEffect(() => {
		disconnect();
	}, [disconnect]);

	const balance = queries.queryBalances
		.getQueryBech32Address(address)
		.stakable.balance.trim(true)
		.maxDecimals(2)
		.shrink(true)
		.upperCase(true)
		.toString();

	return (
		<div>
			{isAccountConnected ? (
				<React.Fragment>
					<div className="flex items-center justify-center mb-4">
						<div className="p-4">
							<img
								alt="wallet"
								className="w-6 h-6"
								src={`${MISC.ASSETS_BASE}/icons/wallet.svg`}
								style={{ filter: isDark ? 'none' : 'invert(1)' }}
							/>
						</div>
						<div className="flex flex-col">
							<TextStyled>
								<p className="font-semibold text-lg">{name}</p>
								<p className="opacity-50 text-sm">{balance}</p>
								{version && (
									<>
										<p className="font-semibold text-lg mt-1">Network</p>
										<p className="opacity-50 text-sm">{network}</p>
									</>
								)}
							</TextStyled>
						</div>
					</div>
					{!isMobileWeb ? (
						<div className="flex justify-center">
							<Button
								backgroundStyle="primary"
								onClick={e => {
									e.preventDefault();
									disconnectAccount();
									disconnect();
									queries.rebus.queryAccount.get(address).cancel();
								}}>
								<div className="flex items-center">
									<img alt="sign-out" className="w-6 h-6" src={`${MISC.ASSETS_BASE}/icons/sign-out-secondary.svg`} />
									<p className="text-base max-w-24 ml-2 overflow-x-hidden truncate transition-all">Sign Out</p>
								</div>
							</Button>
						</div>
					) : null}
				</React.Fragment>
			) : (
				<ConnectAccountButton
					style={{ marginBottom: '16px' }}
					className="h-9"
					textStyle={{ fontSize: '14px' }}
					onClick={e => {
						e.preventDefault();
						connectAccount();
					}}
				/>
			)}
			<p style={{ color: isDark ? 'rgb(241 245 249)' : 'rgb(71 85 105)' }} className="w-full text-center text-xs mt-4">
				Price Data by CoinGecko
			</p>
			<div className="pl-2 flex items-center transition-all w-full mt-2" style={{ justifyContent: 'space-around' }}>
				<button
					onClick={() => window.open(LINKS.TWITTER)}
					className="opacity-75 hover:opacity-100 cursor-pointer mb-0.5 mr-1">
					<img
						alt="twitter"
						style={{ width: '20px', height: '20px', filter: isDark ? 'none' : 'invert(1)' }}
						className="w-8 h-8"
						src={`${MISC.ASSETS_BASE}/icons/twitter.svg`}
					/>
				</button>
				<button
					onClick={() => window.open(LINKS.MEDIUM)}
					className="opacity-75 hover:opacity-100 cursor-pointer mr-1 mb-0.5">
					<img
						alt="medium"
						style={{
							width: '24px',
							height: '24px',
							filter: isDark ? 'none' : 'invert(1)',
						}}
						className="w-8 h-8"
						src={`${MISC.ASSETS_BASE}/icons/medium.svg`}
					/>
				</button>
				<button
					onClick={() => window.open(LINKS.DISCORD)}
					className="opacity-75 hover:opacity-100 cursor-pointer mb-0.5">
					<img
						alt="discord"
						className="w-8 h-8"
						src={`${MISC.ASSETS_BASE}/icons/discord.svg`}
						style={{ filter: isDark ? 'none' : 'invert(1)' }}
					/>
				</button>
				<button
					onClick={() => window.open(LINKS.GITHUB)}
					className="opacity-75 hover:opacity-100 cursor-pointer mb-0.5">
					<img
						alt="github"
						className="w-8 h-8"
						src={`${MISC.ASSETS_BASE}/icons/github.svg`}
						style={{ filter: isDark ? 'none' : 'invert(1)' }}
					/>
				</button>
			</div>
		</div>
	);
});

const TextStyled = styled.p`
	color: ${props => props.theme.text};
`;

const HorizontalLine = styled.div`
	width: 95%;
	border-top: 1px solid ${props => props.theme.gray.darker};
	margin: 16px auto;
`;
