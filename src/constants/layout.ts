import { ROUTES } from './routes';
import { REBUSLINKSMAIN, REBUSLINKSTEST } from './links';
import { config } from 'src/config-insync';

const network = config.NETWORK_TYPE;
const isTestNet = network === 'testnet';

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
		STAKE: {
			TYPE: 'stake',
			ICON: '/public/assets/icons/stake.svg',
			ICON_SELECTED: '/public/assets/icons/stake-selected.svg',
			TEXT: 'Stake',
			LINK: isTestNet ? REBUSLINKSTEST.EXPLORER.STAKE : REBUSLINKSMAIN.EXPLORER.STAKE,
		},
		PROPOSALS: {
			TYPE: 'proposals',
			ICON: '/public/assets/icons/vote.svg',
			ICON_SELECTED: '/public/assets/icons/vote-selected.svg',
			TEXT: 'Vote',
			LINK: isTestNet ? REBUSLINKSTEST.EXPLORER.VOTE : REBUSLINKSMAIN.EXPLORER.VOTE,
		},
		NFT_ID: {
			TYPE: 'nft-id',
			ICON: '/public/assets/icons/nft-id.svg',
			ICON_SELECTED: '/public/assets/icons/nft-id-selected.svg',
			ICON_WIDTH_CLASS: 'w-4',
			TEXT: 'NFT ID',
			ROUTE: ROUTES.NFT_ID,
			SELECTED_CHECK: [ROUTES.NFT_ID, /\/nft-id\/*/],
		},
		TOOLS: {
			TYPE: 'tools',
			ICON: '/public/assets/icons/tools.svg',
			ICON_SELECTED: '/public/assets/icons/tools-selected.svg',
			TEXT: 'Tools',
			ROUTE: ROUTES.TOOLS,
			SELECTED_CHECK: [ROUTES.TOOLS, ROUTES.IBC_TRANSFER],
			SUBLAYOUT: {
				CONVERTER: {
					TYPE: 'converter',
					ICON: '/public/assets/icons/converter.svg',
					ICON_SELECTED: '/public/assets/icons/converter-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Converter',
					ROUTE: ROUTES.TOOLS,
					SELECTED_CHECK: ROUTES.TOOLS,
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
			},
		},
		EXPLORER: {
			TYPE: 'explorer',
			ICON: '/public/assets/icons/explorer.svg',
			ICON_SELECTED: '/public/assets/icons/explorer-selected.svg',
			TEXT: 'Explorer',
			ROUTE: ROUTES.EXPLORER,
			SELECTED_CHECK: ROUTES.EXPLORER,
			SUBLAYOUT: {
				BLOCKS: {
					TYPE: 'blocks',
					ICON: '/public/assets/icons/blocks.svg',
					ICON_SELECTED: '/public/assets/icons/blocks-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Blocks',
					LINK: isTestNet ? REBUSLINKSTEST.EXPLORER.BLOCKS : REBUSLINKSMAIN.EXPLORER.BLOCKS,
				},
				TRANSACTIONS: {
					TYPE: 'transactions',
					ICON: '/public/assets/icons/transactions.svg',
					ICON_SELECTED: '/public/assets/icons/transactions-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Transactions',
					LINK: isTestNet ? REBUSLINKSTEST.EXPLORER.TRANSACTIONS : REBUSLINKSMAIN.EXPLORER.TRANSACTIONS,
				},
				INFO: {
					TYPE: 'info',
					ICON: '/public/assets/icons/info.svg',
					ICON_SELECTED: '/public/assets/icons/info-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Info',
					LINK: isTestNet ? REBUSLINKSTEST.EXPLORER.INFO : REBUSLINKSMAIN.EXPLORER.INFO,
				},
			},
		},
		EVM: {
			TYPE: 'evm',
			ICON: '/public/assets/icons/evm.svg',
			ICON_SELECTED: '/public/assets/icons/evm-selected.svg',
			TEXT: 'EVM',
			ROUTE: ROUTES.EVM,
			SELECTED_CHECK: ROUTES.EVM,
			SUBLAYOUT: {
				BLOCKS: {
					TYPE: 'blocks',
					ICON: '/public/assets/icons/blocks.svg',
					ICON_SELECTED: '/public/assets/icons/blocks-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Blocks',
					LINK: isTestNet ? REBUSLINKSTEST.EVM.BLOCKS : REBUSLINKSMAIN.EVM.BLOCKS,
				},
				TRANSACTIONS: {
					TYPE: 'transactions',
					ICON: '/public/assets/icons/transactions.svg',
					ICON_SELECTED: '/public/assets/icons/transactions-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Transactions',
					LINK: isTestNet ? REBUSLINKSTEST.EVM.TRANSACTIONS : REBUSLINKSMAIN.EVM.TRANSACTIONS,
				},
				TOKENS: {
					TYPE: 'tokens',
					ICON: '/public/assets/icons/tokens.svg',
					ICON_SELECTED: '/public/assets/icons/tokens-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'Tokens',
					LINK: isTestNet ? REBUSLINKSTEST.EVM.TOKENS : REBUSLINKSMAIN.EVM.TOKENS,
				},
				API: {
					TYPE: 'api',
					ICON: '/public/assets/icons/api.svg',
					ICON_SELECTED: '/public/assets/icons/api-selected.svg',
					ICON_WIDTH_CLASS: 'w-4',
					TEXT: 'API',
					LINK: isTestNet ? REBUSLINKSTEST.EVM.API : REBUSLINKSMAIN.EVM.API,
				},
			},
		},
	},
};
export type TSIDEBAR_ITEM = {
	TYPE: string;
	ICON: string;
	ICON_WIDTH_CLASS: string;
	ICON_SELECTED: string;
	TEXT: string;
	ROUTE?: string;
	SELECTED_CHECK?: TSIDEBAR_SELECTED_CHECK;
} & {
	ICON: string;
	TEXT: string;
	LINK?: string;
};

export type TSIDEBAR_SELECTED_CHECK = string | (string | RegExp)[];
