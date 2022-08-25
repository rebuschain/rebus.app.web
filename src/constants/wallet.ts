export const WALLET_LIST: {
	name: string;
	description: string;
	logoUrl: string;
	type: 'extension' | 'wallet-connect';
	etherumWallet?: 'metamask' | 'crypto';
	link?: string;
}[] = [
	{
		name: 'Keplr Wallet',
		description: 'Keplr Browser Extension',
		logoUrl: '/public/assets/other-logos/keplr.png',
		type: 'extension',
	},
	{
		name: 'WalletConnect',
		description: 'Keplr Mobile',
		logoUrl: '/public/assets/other-logos/wallet-connect.png',
		type: 'wallet-connect',
	},
	{
		name: 'Metamask',
		description: 'Metamask Browser Extension',
		logoUrl: '/public/assets/other-logos/metamask.png',
		type: 'extension',
		etherumWallet: 'metamask',
		link: 'https://metamask.io/',
	},
	{
		name: 'Crypto.com',
		description: 'Crypto.com Browser Extension (Transactions Not Supported)',
		logoUrl: '/public/assets/other-logos/crypto.jpg',
		type: 'extension',
		etherumWallet: 'crypto',
	},
];
