import { ROUTES } from './routes';

export const LAYOUT = {
	SIDEBAR: {
		ASSETS: {
			TYPE: 'assets',
			ICON: '/public/assets/icons/assets.svg',
			ICON_SELECTED: '/public/assets/icons/assets-selected.svg',
			TEXT: 'Assets',
			ROUTE: ROUTES.ASSETS,
			SELECTED_CHECK: ROUTES.ASSETS,
		},
		IBC_TRANSFER: {
			TYPE: 'ibc-transfer',
			ICON: '/public/assets/icons/ibc-transfer.svg',
			ICON_SELECTED: '/public/assets/icons/ibc-transfer-selected.svg',
			ICON_WIDTH_CLASS: 'w-4',
			TEXT: 'IBC Transfer',
			ROUTE: ROUTES.IBC_TRANSFER,
			SELECTED_CHECK: ROUTES.IBC_TRANSFER,
		},
		STAKE: {
			TYPE: 'stake',
			ICON: '/public/assets/icons/stake.svg',
			ICON_SELECTED: '/public/assets/icons/stake-selected.svg',
			TEXT: 'Stake',
			ROUTE: ROUTES.STAKE,
			SELECTED_CHECK: ROUTES.STAKE,
		},
		AIRDROP: {
			TYPE: 'airdrop',
			ICON: '/public/assets/icons/airdrop.svg',
			ICON_SELECTED: '/public/assets/icons/airdrop-selected.svg',
			TEXT: 'Airdrop',
			ROUTE: ROUTES.AIRDROP,
			SELECTED_CHECK: ROUTES.AIRDROP,
		},
		PROPOSALS: {
			TYPE: 'proposals',
			ICON: '/public/assets/icons/vote.svg',
			ICON_SELECTED: '/public/assets/icons/vote-selected.svg',
			TEXT: 'Vote',
			ROUTE: ROUTES.VOTE,
			SELECTED_CHECK: ROUTES.VOTE,
		},
		NFT_ID: {
			TYPE: 'nft-id',
			ICON: '/public/assets/icons/nft-id.svg',
			ICON_SELECTED: '/public/assets/icons/nft-id-selected.svg',
			ICON_WIDTH_CLASS: 'w-4',
			TEXT: 'NFT ID',
			ROUTE: ROUTES.NFT_ID,
			SELECTED_CHECK: ROUTES.NFT_ID,
		},
		TOOLS: {
			TYPE: 'tools',
			ICON: '/public/assets/icons/tools.svg',
			ICON_SELECTED: '/public/assets/icons/tools-selected.svg',
			TEXT: 'Tools',
			ROUTE: ROUTES.TOOLS,
			SELECTED_CHECK: ROUTES.TOOLS,
		},
	},
};
export type TSIDEBAR_ITEM = {
	TYPE: 'assets' | 'ibc-transfer' | 'stake' | 'airdrop' | 'proposals' | 'tools' | 'nft-id';
	ICON: string;
	ICON_WIDTH_CLASS: string;
	ICON_SELECTED: string;
	TEXT: string;
	ROUTE: string;
	SELECTED_CHECK: TSIDEBAR_SELECTED_CHECK;
} & {
	ICON: string;
	TEXT: string;
	LINK: string;
};

export type TSIDEBAR_SELECTED_CHECK = string | (string | RegExp)[];
