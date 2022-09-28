import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { Button } from 'src/components/common/button';
import { useActions } from 'src/hooks/use-actions';
import { LINKS } from 'src/constants/links';
import { MISC } from 'src/constants';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import { useStore } from 'src/stores';
import * as extraActions from 'src/reducers/extra-actions';
import { ConnectAccountButton } from '../../connect-account-button';

export const SidebarBottom: FunctionComponent = observer(() => {
	const [disconnect] = useActions([extraActions.disconnect]);

	const { chainStore, accountStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const name = walletStore.isLoaded ? walletStore.accountName : account.name;

	const { isAccountConnected, connectAccount, disconnectAccount, isMobileWeb } = useAccountConnection();

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
					<div className="flex items-center mb-2">
						<div className="p-4">
							<img alt="wallet" className="w-5 h-5" src={`${MISC.ASSETS_BASE}/icons/wallet.svg`} />
						</div>
						<div className="flex flex-col">
							<p className="font-semibold text-white-high text-base">{name}</p>
							<p className="opacity-50 text-white-emphasis text-sm">{balance}</p>
						</div>
					</div>
					{!isMobileWeb ? (
						<Button
							backgroundStyle="gradient-blue"
							onClick={e => {
								e.preventDefault();
								disconnectAccount();
								disconnect();
							}}
							className="w-full mb-8">
							<img alt="sign-out" className="w-5 h-5" src={`${MISC.ASSETS_BASE}/icons/sign-out-secondary.svg`} />
							<p className="text-sm max-w-24 ml-3 overflow-x-hidden truncate transition-all">Sign Out</p>
						</Button>
					) : null}
				</React.Fragment>
			) : (
				<ConnectAccountButton
					style={{ marginBottom: '32px' }}
					className="h-9"
					textStyle={{ fontSize: '14px' }}
					onClick={e => {
						e.preventDefault();
						connectAccount();
					}}
				/>
			)}
			<p className="py-2 text-xs text-white-high text-center opacity-30">
				Price Data by
				<a href="https://www.coingecko.com" target="_blank" rel="noreferrer">
					{' CoinGecko'}
				</a>
			</p>
			{/* <div className={'flex items-center transition-all w-full'}> */}
			{/*<Img className="w-9 h-9" src={`${MISC.ASSETS_BASE}/icons/${openSidebar ? 'menu-in' : 'menu'}.svg`} />*/}
			<div
				className="flex items-center transition-all overflow-x-hidden w-full"
				style={{ justifyContent: 'space-around' }}>
				<button
					onClick={() => window.open(LINKS.TWITTER)}
					className="opacity-75 hover:opacity-100 cursor-pointer mb-0.5 mr-1">
					<img
						alt="twitter"
						style={{ minWidth: '32px' }}
						className="w-8 h-8"
						src={`${MISC.ASSETS_BASE}/icons/twitter.svg`}
					/>
				</button>
				<button onClick={() => window.open(LINKS.MEDIUM)} className="opacity-75 hover:opacity-100 cursor-pointer mr-1">
					<img
						alt="medium"
						style={{ minWidth: '36px' }}
						className="w-9 h-9"
						src={`${MISC.ASSETS_BASE}/icons/medium.svg`}
					/>
				</button>
				<button
					onClick={() => window.open(LINKS.DISCORD)}
					className="opacity-75 hover:opacity-100 cursor-pointer mb-0.5">
					<img
						alt="discord"
						style={{ minWidth: '36px' }}
						className="w-9 h-9"
						src={`${MISC.ASSETS_BASE}/icons/discord.svg`}
					/>
				</button>
				<button
					onClick={() => window.open(LINKS.TELEGRAM)}
					className="opacity-75 hover:opacity-100 cursor-pointer mb-0.5">
					<img
						alt="telegram"
						style={{ minWidth: '36px' }}
						className="w-9 h-9"
						src={`${MISC.ASSETS_BASE}/icons/telegram.svg`}
					/>
				</button>
			</div>
		</div>
	);
});
