import { Bech32Address } from '@keplr-wallet/cosmos';
import { ChainInfoWithExplorer } from './stores/chain';
import env from '@beam-australia/react-env';

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
			{
				coinDenom: 'LUDUS',
				coinMinimalDenom: 'uludus',
				coinDecimals: 6,
				coinGeckoId: 'ludus',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ludus.png',
			},
			{
				coinDenom: 'OSMO',
				coinMinimalDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
				originCurrency: {
					coinDenom: 'OSMO',
					coinMinimalDenom: 'uosmo',
					coinDecimals: 6,
					coinGeckoId: 'osmosis',
					coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
				},
				coinDecimals: 6,
				coinGeckoId: 'osmosis',
				coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
				paths: [
					{
						portId: 'transfer',
						channelId: 'channel-355',
					},
				],
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
		explorerUrlToTx: `${env('EXPLORER_URL')}/txs/{txHash}`,
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
				coinMinimalDenom: minDenom,
				coinDecimals: decimals,
				coinGeckoId: prefix,
				coinImageUrl,
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
];
