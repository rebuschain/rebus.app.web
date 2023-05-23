import { Bech32Address } from '@keplr-wallet/cosmos';
import { ChainInfoWithExplorer } from './stores/chain';
import env from '@beam-australia/react-env';
import { AppCurrency } from '@keplr-wallet/types';

export const RewardEpochIdentifier = 'day';

const prefix = env('PREFIX');
const denom = env('COIN_DENOM');
const minDenom = env('COIN_MINIMAL_DENOM');
const decimals = parseInt(env('COIN_DECIMALS'), 10);
const coinImageUrl = window.location.origin + '/public/assets/main/rebus-logo-single.svg';

/**
 * Determine the channel info per the chain.
 * Guide users to use the same channel for convenience.
 */
export const IBCAssetInfos: {
	counterpartyChainId: string;
	// Souce channel id
	sourceChannelId: string;
	// Destination channel id
	destChannelId: string;
	coinMinimalDenom: string;
	// In some reasons, ibc channel is in unstable status.
	// Disable the deposit, withdraw button and show the tooltip.
	isUnstable?: boolean;

	// If the asset is from ics20-cw20
	ics20ContractAddress?: string;

	// If the asset is from ics20-cw20
	ibcTransferPathDenom?: string;

	// If the asset requires a custom deposit external link
	depositUrlOverride?: string;

	// If the asset requires a custom withdrawal external link
	withdrawUrlOverride?: string;
}[] = [
	// {
	// 	counterpartyChainId: 'osmosis-1',
	// 	sourceChannelId: 'channel-0',
	// 	destChannelId: 'channel-355',
	// 	coinMinimalDenom: 'uosmo',
	// },
];

// Used in the IBC transfer page to transfer rebus-osmosis
export const IBCTransferInfo = {
	rebusChannelId: 'channel-0',
	osmosisChannelId: 'channel-355',
};

const LudusCoin = {
	coinDenom: 'LUDUS',
	coinMinimalDenom: 'uludus',
	coinDecimals: 6,
	coinGeckoId: 'ludus',
	coinImageUrl: window.location.origin + '/public/assets/tokens/ludus.png',
};

const OsmoCoin = {
	coinDenom: 'OSMO',
	coinMinimalDenom: 'uosmo',
	coinDecimals: 6,
	coinGeckoId: 'osmosis',
	coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
};

const AtomCoin = {
	coinDenom: 'ATOM',
	coinMinimalDenom: 'uatom',
	coinDecimals: 6,
	coinGeckoId: 'pool:uatom',
	coinImageUrl: window.location.origin + '/public/assets/tokens/atom.svg',
};

const isMainnet = env('NETWORK_TYPE') === 'mainnet';

/**
 * Determine the channel info per the chain.
 * Guide users to use the same channel for convenience.
 */
export const ERC20AssetInfos: {
	contractAddress: string;
	currency: AppCurrency;
}[] = [
	{
		contractAddress: '0x80b5a32E4F032B2a058b4F29EC95EEfEEB87aDcd',
		currency: LudusCoin,
	},
	// isMainnet && {
	// 	contractAddress: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
	// 	currency: OsmoCoin,
	// },
	// isMainnet && {
	// 	contractAddress: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
	// 	currency: AtomCoin,
	// },
].filter(Boolean) as any;

export const ContractAddresses = {
	ERC20: '0xa5A785D77ECcc28ECcBDCc9Fc1E81B0d57618D12',
};

export const EmbedChainInfos: ChainInfoWithExplorer[] = [
	{
		rpc: env('RPC_URL'),
		rest: env('REST_URL'),
		chainId: env('CHAIN_ID'),
		chainName: env('CHAIN_NAME'),
		walletUrlForStaking: env('STAKING_URL'),
		stakeCurrency: {
			coinDenom: denom,
			coinMinimalDenom: minDenom,
			coinDecimals: decimals,
			coinGeckoId: prefix,
			coinImageUrl,
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: {
			bech32PrefixAccAddr: prefix,
			bech32PrefixAccPub: `${prefix}pub`,
			bech32PrefixValAddr: `${prefix}valoper`,
			bech32PrefixValPub: `${prefix}valoperpub`,
			bech32PrefixConsAddr: `${prefix}valcons`,
			bech32PrefixConsPub: `${prefix}valconspub`,
		},
		currencies: [
			{
				coinDenom: denom,
				coinMinimalDenom: minDenom,
				coinDecimals: decimals,
				coinGeckoId: prefix,
				coinImageUrl,
			},
			LudusCoin,
			{
				coinDenom: 'OSMO',
				coinMinimalDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
				originCurrency: OsmoCoin,
				coinDecimals: 6,
				coinGeckoId: 'osmosis',
				coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: denom,
				coinMinimalDenom: minDenom,
				coinDecimals: decimals,
				coinGeckoId: prefix,
				coinImageUrl,
			},
		],
		gasPriceStep: {
			low: parseFloat(env('GAS_PRICE_STEP_LOW')),
			average: parseFloat(env('GAS_PRICE_STEP_AVERAGE')),
			high: parseFloat(env('GAS_PRICE_STEP_HIGH')),
		},
		explorerUrlToTx: `${env('EXPLORER_URL')}/{txHash}`,
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
	},
	{
		rpc: 'https://rpc-osmosis.keplr.app',
		rest: 'https://lcd-osmosis.keplr.app',
		chainId: 'osmosis-1',
		chainName: 'Osmosis',
		stakeCurrency: {
			coinDenom: 'OSMO',
			coinMinimalDenom: 'uosmo',
			coinDecimals: 6,
			coinGeckoId: 'osmosis',
			coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('osmo'),
		currencies: [
			{
				coinDenom: 'OSMO',
				coinMinimalDenom: 'uosmo',
				coinDecimals: 6,
				coinGeckoId: 'osmosis',
				coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
			},
			{
				coinDenom: 'ION',
				coinMinimalDenom: 'uion',
				coinDecimals: 6,
				coinGeckoId: 'ion',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ion.png',
			},
			{
				coinDenom: denom,
				coinMinimalDenom: 'ibc/A1AC7F9EE2F643A68E3A35BCEB22040120BEA4059773BB56985C76BDFEBC71D9',
				coinDecimals: decimals,
				coinGeckoId: prefix,
				coinImageUrl,
				originCurrency: {
					coinDenom: denom,
					coinMinimalDenom: minDenom,
					coinDecimals: decimals,
					coinGeckoId: prefix,
					coinImageUrl,
				},
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'OSMO',
				coinMinimalDenom: 'uosmo',
				coinDecimals: 6,
				coinGeckoId: 'osmosis',
				coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
			},
		],
		gasPriceStep: {
			low: 0,
			average: 0,
			high: 0.025,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://www.mintscan.io/osmosis/txs/{txHash}',
	},
	// {
	// 	rpc: 'https://rpc-cosmoshub.keplr.app',
	// 	rest: 'https://lcd-cosmoshub.keplr.app',
	// 	chainId: 'cosmoshub-4',
	// 	chainName: 'Cosmos Hub',
	// 	bip44: {
	// 		coinType: 118,
	// 	},
	// 	bech32Config: Bech32Address.defaultBech32Config('cosmos'),
	// 	stakeCurrency: AtomCoin,
	// 	currencies: [AtomCoin],
	// 	feeCurrencies: [AtomCoin],
	// 	gasPriceStep: {
	// 		low: 0.01,
	// 		average: 0.025,
	// 		high: 0.03,
	// 	},
	// 	features: ['ibc-transfer', 'ibc-go'],
	// 	explorerUrlToTx: 'https://www.mintscan.io/cosmos/txs/{txHash}',
	// },
];
