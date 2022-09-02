import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConnectWalletDialog, KeyAutoConnectingWalletType, KeyConnectingWalletType, WalletType } from 'src/dialogs';
import { useStore } from 'src/stores';
import { getKeplrFromWindow, WalletStatus } from '@keplr-wallet/stores';
import { observer } from 'mobx-react-lite';

export interface AccountConnection {
	isAccountConnected: boolean | WalletType;
	disconnectAccount: () => Promise<void>;
	connectAccount: () => void;
	isMobileWeb: boolean;
}

export const AccountConnectionContext = React.createContext<AccountConnection | null>(null);

export const AccountConnectionProvider: FunctionComponent = observer(({ children }) => {
	const { chainStore, accountStore, walletStore, connectWalletManager } = useStore();
	const [isOpenDialog, setIsOpenDialog] = useState(false);

	const account = accountStore.getAccount(chainStore.current.chainId);

	const [isMobileWeb, setIsMobileWeb] = useState(false);
	useEffect(() => {
		getKeplrFromWindow().then(keplr => {
			if (keplr && keplr.mode === 'mobile-web') {
				localStorage?.removeItem(KeyConnectingWalletType);
				localStorage?.removeItem(KeyAutoConnectingWalletType);
				setIsMobileWeb(true);
			}
		});
	}, []);

	// Even though the wallet is not loaded, if `shouldAutoConnectAccount` is true, set the `isAccountConnected` as true.
	// Because the initing the wallet is asyncronous, when users enter the site the wallet is seen as not loaded.
	// To reduce this problem, if the wallet is connected when users enter the site, just assume that the wallet is already connected.
	const isAccountConnected =
		account.walletStatus === WalletStatus.Loaded ||
		connectWalletManager.autoConnectingWalletType ||
		isMobileWeb ||
		walletStore.isLoaded;

	const disconnectAccount = useCallback(async () => {
		connectWalletManager.disableAutoConnect();
		connectWalletManager.disconnect();
	}, [connectWalletManager]);

	const openDialog = useCallback(() => setIsOpenDialog(true), []);
	const closeDialog = useCallback(() => setIsOpenDialog(false), []);

	const connectAccount = useCallback(() => {
		openDialog();
	}, [openDialog]);

	useEffect(() => {
		if (isMobileWeb) {
			account.init();
		}
	}, [account, isMobileWeb]);

	useEffect(() => {
		// SetTimeout is used to make sure the extensions have been loaded into the window object before we call the init code
		setTimeout(() => {
			if (connectWalletManager.autoConnectingWalletType === 'extension' && connectWalletManager.connectingWalletName) {
				walletStore.init(connectWalletManager.connectingWalletName as any, false, false).then(success => {
					localStorage.setItem(KeyAutoConnectingWalletType, success ? 'extension' : '');
					if (!success) {
						connectWalletManager.disableAutoConnect();
					}
				});
			} else if (!!connectWalletManager.autoConnectingWalletType && account.walletStatus === WalletStatus.NotInit) {
				account.init();
			}
		});
	}, [
		account,
		connectWalletManager,
		connectWalletManager.autoConnectingWalletType,
		connectWalletManager.connectingWalletName,
		walletStore,
	]);

	/*
	    Disconnect the accounts if the wallet doesn't exist or the connection rejected.
	    Below looks somewhat strange in React philosophy.
	    But, it is hard to use the `useEffect` hook because the references of the chain store and account store is persistent.
	    Even though belows will be executed on rerendering of this component,
	    it is likely this component will not be rerendered frequently because this component only handle the connection of account.
	    If some account's wallet status changed, the observer makes this component be rerendered.
	 */
	for (const chainInfo of chainStore.chainInfos) {
		const account = accountStore.getAccount(chainInfo.chainId);

		if (account.walletStatus === WalletStatus.NotExist || account.walletStatus === WalletStatus.Rejected) {
			if (chainInfo.chainId === chainStore.current.chainId) {
				connectWalletManager.disableAutoConnect();
				connectWalletManager.disconnect();
			} else {
				account.disconnect();
			}
		}
	}

	// temp code
	const ref = useRef(null);

	return (
		<AccountConnectionContext.Provider
			value={useMemo(() => {
				return {
					isAccountConnected,
					disconnectAccount,
					connectAccount,
					isMobileWeb,
				};
			}, [connectAccount, disconnectAccount, isAccountConnected, isMobileWeb])}>
			{children}
			<ConnectWalletDialog initialFocus={ref} isOpen={isOpenDialog} close={closeDialog} />
		</AccountConnectionContext.Provider>
	);
});
