import { ROUTES } from './routes';

export const LAYOUT = {
	SIDEBAR: {
		/*TRADE: {
			ICON: '/public/assets/icons/trade.svg',
			ICON_SELECTED: '/public/assets/icons/trade-selected.svg',
			TEXT: 'Trade',
			ROUTE: '/',
			SELECTED_CHECK: '/',
		},
		POOLS: {
			ICON: '/public/assets/icons/pool.svg',
			ICON_SELECTED: '/public/assets/icons/pool-selected.svg',
			TEXT: 'Pools',
			SELECTED_CHECK: [ROUTES.POOLS, /\/pool\/[0-9]+/],
			ROUTE: ROUTES.POOLS,
		},*/
		/*
		LBP: {
			ICON: '/public/assets/icons/lbp.svg',
			ICON_SELECTED: '/public/assets/icons/lbp-selected.svg',
			TEXT: 'LBP',
			ROUTE: '/bootstrap',
			SELECTED_CHECK: '/bootstrap',
		},
		ASSETS: {
			ICON: '/public/assets/icons/assets.svg',
			ICON_SELECTED: '/public/assets/icons/assets-selected.svg',
			TEXT: 'Assets',
			ROUTE: '/assets',
			SELECTED_CHECK: '/assets',
		},
		 */
		STAKE: {
			ICON: '/public/assets/icons/stake.svg',
			ICON_SELECTED: '/public/assets/icons/stake-selected.svg',
			TEXT: 'Stake',
			ROUTE: '/staking',
			SELECTED_CHECK: '/staking',
		},
		AIRDROP: {
			ICON: '/public/assets/icons/airdrop.svg',
			ICON_SELECTED: '/public/assets/icons/airdrop-selected.svg',
			TEXT: 'Airdrop',
			ROUTE: '/airdrop',
			SELECTED_CHECK: '/airdrop',
		},
		PROPOSALS: {
			ICON: '/public/assets/icons/vote.svg',
			ICON_SELECTED: '/public/assets/icons/vote-selected.svg',
			TEXT: 'Vote',
			ROUTE: '/proposals',
			SELECTED_CHECK: '/proposals',
		},
		TOOLS: {
			ICON: '/public/assets/icons/tools.svg',
			ICON_SELECTED: '/public/assets/icons/tools-selected.svg',
			TEXT: 'Tools',
			ROUTE: ROUTES.TOOLS,
			SELECTED_CHECK: ROUTES.TOOLS,
		},
	},
};
export type TSIDEBAR_ITEM = {
	ICON: string;
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
