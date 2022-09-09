export type WalletTypes = 'metamask' | 'crypto' | 'cosmostation' | 'falcon' | undefined;

(window as any).enableFalcon = (isEnabled = true) => {
	localStorage.setItem('falcon_enabled', isEnabled ? 'true' : 'false');
	window.location.reload();
};

// Wallets do not work on safari
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const isExtensionEnvironment = !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const WALLET_LIST: {
	name: string;
	description: string;
	logoUrl: string;
	type: 'extension' | 'wallet-connect';
	walletType?: WalletTypes;
	link?: string;
}[] = [
	isExtensionEnvironment && {
		name: 'Keplr Wallet',
		description: 'Keplr Browser Extension',
		logoUrl: '/public/assets/other-logos/keplr.png',
		type: 'extension',
	},
	// Disable mobile app for now since it is not working at all with rebus
	false && {
		name: 'WalletConnect',
		description: 'Keplr Mobile',
		logoUrl: '/public/assets/other-logos/wallet-connect.png',
		type: 'wallet-connect',
	},
	isExtensionEnvironment && {
		name: 'Metamask',
		description: 'Metamask Browser Extension',
		logoUrl: '/public/assets/other-logos/metamask.png',
		type: 'extension',
		walletType: 'metamask',
		link: 'https://metamask.io/',
	},
	isExtensionEnvironment && {
		name: 'Cosmostation',
		description: 'Cosmostation Browser Extension',
		logoUrl: '/public/assets/other-logos/cosmostation.jpg',
		type: 'extension',
		walletType: 'cosmostation',
		link: 'https://www.cosmostation.io/wallet/',
	},
	(localStorage.getItem('falcon_enabled') === 'true' &&
		isExtensionEnvironment && {
			name: 'Falcon',
			description: 'Falcon Browser Extension',
			logoUrl: '/public/assets/other-logos/falcon.jpg',
			type: 'extension',
			walletType: 'falcon',
			link: 'https://www.falconwallet.app/',
		}) as any,
	isExtensionEnvironment && {
		name: 'Crypto.com',
		description: 'Crypto.com Browser Extension (Transactions Not Supported)',
		logoUrl: '/public/assets/other-logos/crypto.jpg',
		type: 'extension',
		walletType: 'crypto',
	},
].filter(Boolean);
