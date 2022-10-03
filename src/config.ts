import { Bech32Address } from '@keplr-wallet/cosmos';
import { ChainInfoWithExplorer } from './stores/chain';
import { DenomHelper } from '@keplr-wallet/common';
import { Int } from '@keplr-wallet/unit';
import env from '@beam-australia/react-env';

export const RewardEpochIdentifier = 'day';

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
	{
		counterpartyChainId: 'cosmoshub-4',
		sourceChannelId: 'channel-0',
		destChannelId: 'channel-141',
		coinMinimalDenom: 'uatom',
	},
	{
		counterpartyChainId: 'columbus-5',
		sourceChannelId: 'channel-72',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'uluna',
	},
	{
		counterpartyChainId: 'crypto-org-chain-mainnet-1',
		sourceChannelId: 'channel-5',
		destChannelId: 'channel-10',
		coinMinimalDenom: 'basecro',
	},
	{
		counterpartyChainId: 'columbus-5',
		sourceChannelId: 'channel-72',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'uusd',
	},
	{
		counterpartyChainId: 'secret-4',
		sourceChannelId: 'channel-88',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'uscrt',
	},
	{
		counterpartyChainId: 'juno-1',
		sourceChannelId: 'channel-42',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'ujuno',
	},
	{
		counterpartyChainId: 'juno-1',
		sourceChannelId: 'channel-169',
		destChannelId: 'channel-47',
		coinMinimalDenom: 'cw20:juno168ctmpyppk90d34p3jjy658zf5a5l3w8wk35wht6ccqj4mr0yv8s4j5awr',
		ics20ContractAddress: 'juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn',
	},
	{
		counterpartyChainId: 'stargaze-1',
		sourceChannelId: 'channel-75',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'ustars',
	},
	{
		counterpartyChainId: 'chihuahua-1',
		sourceChannelId: 'channel-113',
		destChannelId: 'channel-7',
		coinMinimalDenom: 'uhuahua',
	},
	{
		counterpartyChainId: 'core-1',
		sourceChannelId: 'channel-4',
		destChannelId: 'channel-6',
		coinMinimalDenom: 'uxprt',
	},
	{
		counterpartyChainId: 'core-1',
		sourceChannelId: 'channel-4',
		destChannelId: 'channel-6',
		coinMinimalDenom: 'ibc/A6E3AF63B3C906416A9AF7A556C59EA4BD50E617EFFE6299B99700CCB780E444',
		ibcTransferPathDenom: 'transfer/channel-38/gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006',
	},
	{
		counterpartyChainId: 'akashnet-2',
		sourceChannelId: 'channel-1',
		destChannelId: 'channel-9',
		coinMinimalDenom: 'uakt',
	},
	{
		counterpartyChainId: 'regen-1',
		sourceChannelId: 'channel-8',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'uregen',
	},
	{
		counterpartyChainId: 'sentinelhub-2',
		sourceChannelId: 'channel-2',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'udvpn',
	},
	{
		counterpartyChainId: 'irishub-1',
		sourceChannelId: 'channel-6',
		destChannelId: 'channel-3',
		coinMinimalDenom: 'uiris',
	},
	{
		counterpartyChainId: 'iov-mainnet-ibc',
		sourceChannelId: 'channel-15',
		destChannelId: 'channel-2',
		coinMinimalDenom: 'uiov',
	},
	{
		counterpartyChainId: 'emoney-3',
		sourceChannelId: 'channel-37',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'ungm',
	},
	{
		counterpartyChainId: 'emoney-3',
		sourceChannelId: 'channel-37',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'eeur',
	},
	{
		counterpartyChainId: 'likecoin-mainnet-2',
		sourceChannelId: 'channel-53',
		destChannelId: 'channel-3',
		coinMinimalDenom: 'nanolike',
	},
	{
		counterpartyChainId: 'impacthub-3',
		sourceChannelId: 'channel-38',
		destChannelId: 'channel-4',
		coinMinimalDenom: 'uixo',
	},
	{
		counterpartyChainId: 'bitcanna-1',
		sourceChannelId: 'channel-51',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'ubcna',
	},
	{
		counterpartyChainId: 'bitsong-2b',
		sourceChannelId: 'channel-73',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'ubtsg',
	},
	{
		counterpartyChainId: 'kichain-2',
		sourceChannelId: 'channel-77',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'uxki',
	},
	{
		counterpartyChainId: 'panacea-3',
		sourceChannelId: 'channel-82',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'umed',
	},
	{
		counterpartyChainId: 'bostrom',
		sourceChannelId: 'channel-95',
		destChannelId: 'channel-2',
		coinMinimalDenom: 'boot',
	},
	{
		counterpartyChainId: 'comdex-1',
		sourceChannelId: 'channel-87',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'ucmdx',
	},
	{
		counterpartyChainId: 'cheqd-mainnet-1',
		sourceChannelId: 'channel-108',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'ncheq',
	},
	{
		counterpartyChainId: 'lum-network-1',
		sourceChannelId: 'channel-115',
		destChannelId: 'channel-3',
		coinMinimalDenom: 'ulum',
	},
	{
		counterpartyChainId: 'vidulum-1',
		sourceChannelId: 'channel-124',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'uvdl',
	},
	{
		counterpartyChainId: 'desmos-mainnet',
		sourceChannelId: 'channel-135',
		destChannelId: 'channel-2',
		coinMinimalDenom: 'udsm',
	},
	{
		counterpartyChainId: 'dig-1',
		sourceChannelId: 'channel-128',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'udig',
	},
	{
		counterpartyChainId: 'sommelier-3',
		sourceChannelId: 'channel-165',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'usomm',
	},
	{
		counterpartyChainId: 'sifchain-1',
		sourceChannelId: 'channel-47',
		destChannelId: 'channel-17',
		coinMinimalDenom: 'rowan',
	},
	{
		counterpartyChainId: 'laozi-mainnet',
		sourceChannelId: 'channel-148',
		destChannelId: 'channel-83',
		coinMinimalDenom: 'uband',
	},
	{
		counterpartyChainId: 'darchub',
		sourceChannelId: 'channel-171',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'udarc',
	},
	{
		counterpartyChainId: 'umee-1',
		sourceChannelId: 'channel-184',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'uumee',
	},
	{
		counterpartyChainId: 'gravity-bridge-3',
		sourceChannelId: 'channel-144',
		destChannelId: 'channel-10',
		coinMinimalDenom: 'ugraviton',
	},
	{
		counterpartyChainId: 'mainnet-3',
		sourceChannelId: 'channel-181',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'udec',
	},
	{
		counterpartyChainId: 'juno-1',
		sourceChannelId: 'channel-169',
		destChannelId: 'channel-47',
		coinMinimalDenom: 'cw20:juno1g2g7ucurum66d42g8k5twk34yegdq8c82858gz0tq2fc75zy7khssgnhjl',
		ics20ContractAddress: 'juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn',
	},
	{
		counterpartyChainId: 'carbon-1',
		sourceChannelId: 'channel-188',
		destChannelId: 'channel-0',
		coinMinimalDenom: 'swth',
	},
	{
		counterpartyChainId: 'cerberus-chain-1',
		sourceChannelId: 'channel-212',
		destChannelId: 'channel-1',
		coinMinimalDenom: 'ucrbrus',
	},
];

const prefix = env('PREFIX');
const denom = env('COIN_DENOM');
const minDenom = env('COIN_MINIMAL_DENOM');
const decimals = parseInt(env('COIN_DECIMALS'), 10);
const coinImageUrl = window.location.origin + '/public/assets/main/rebus-logo-single.svg';

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
	{
		rpc: 'https://rpc-cosmoshub.keplr.app',
		rest: 'https://lcd-cosmoshub.keplr.app',
		chainId: 'cosmoshub-4',
		chainName: 'Cosmos Hub',
		stakeCurrency: {
			coinDenom: 'ATOM',
			coinMinimalDenom: 'uatom',
			coinDecimals: 6,
			coinGeckoId: 'cosmos',
			coinImageUrl: window.location.origin + '/public/assets/tokens/atom.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('cosmos'),
		currencies: [
			{
				coinDenom: 'ATOM',
				coinMinimalDenom: 'uatom',
				coinDecimals: 6,
				coinGeckoId: 'cosmos',
				coinImageUrl: window.location.origin + '/public/assets/tokens/atom.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'ATOM',
				coinMinimalDenom: 'uatom',
				coinDecimals: 6,
				coinGeckoId: 'cosmos',
				coinImageUrl: window.location.origin + '/public/assets/tokens/atom.svg',
			},
		],
		coinType: 118,
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://www.mintscan.io/cosmos/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-columbus.keplr.app',
		rest: 'https://lcd-columbus.keplr.app',
		chainId: 'columbus-5',
		chainName: 'Terra',
		stakeCurrency: {
			coinDenom: 'LUNA',
			coinMinimalDenom: 'uluna',
			coinDecimals: 6,
			coinGeckoId: 'terra-luna',
			coinImageUrl: window.location.origin + '/public/assets/tokens/luna.png',
		},
		bip44: {
			coinType: 330,
		},
		bech32Config: Bech32Address.defaultBech32Config('terra'),
		currencies: [
			{
				coinDenom: 'LUNA',
				coinMinimalDenom: 'uluna',
				coinDecimals: 6,
				coinGeckoId: 'terra-luna',
				coinImageUrl: window.location.origin + '/public/assets/tokens/luna.png',
			},
			{
				coinDenom: 'UST',
				coinMinimalDenom: 'uusd',
				coinDecimals: 6,
				coinGeckoId: 'terrausd',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ust.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'LUNA',
				coinMinimalDenom: 'uluna',
				coinDecimals: 6,
				coinGeckoId: 'terra-luna',
				coinImageUrl: window.location.origin + '/public/assets/tokens/luna.png',
			},
			{
				coinDenom: 'UST',
				coinMinimalDenom: 'uusd',
				coinDecimals: 6,
				coinGeckoId: 'terrausd',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ust.png',
			},
		],
		gasPriceStep: {
			low: 0.015,
			average: 0.015,
			high: 0.015,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://finder.terra.money/columbus-5/tx/{txHash}',
	},
	{
		rpc: 'https://rpc-secret.keplr.app',
		rest: 'https://lcd-secret.keplr.app',
		chainId: 'secret-4',
		chainName: 'Secret Network',
		stakeCurrency: {
			coinDenom: 'SCRT',
			coinMinimalDenom: 'uscrt',
			coinDecimals: 6,
			coinGeckoId: 'secret',
			coinImageUrl: window.location.origin + '/public/assets/tokens/scrt.svg',
		},
		bip44: {
			coinType: 529,
		},
		bech32Config: Bech32Address.defaultBech32Config('secret'),
		currencies: [
			{
				coinDenom: 'SCRT',
				coinMinimalDenom: 'uscrt',
				coinDecimals: 6,
				coinGeckoId: 'secret',
				coinImageUrl: window.location.origin + '/public/assets/tokens/scrt.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'SCRT',
				coinMinimalDenom: 'uscrt',
				coinDecimals: 6,
				coinGeckoId: 'secret',
				coinImageUrl: window.location.origin + '/public/assets/tokens/scrt.svg',
			},
		],
		coinType: 118,
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://secretnodes.com/secret/chains/secret-4/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc-akash.keplr.app',
		rest: 'https://lcd-akash.keplr.app',
		chainId: 'akashnet-2',
		chainName: 'Akash',
		stakeCurrency: {
			coinDenom: 'AKT',
			coinMinimalDenom: 'uakt',
			coinDecimals: 6,
			coinGeckoId: 'akash-network',
			coinImageUrl: window.location.origin + '/public/assets/tokens/akt.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('akash'),
		currencies: [
			{
				coinDenom: 'AKT',
				coinMinimalDenom: 'uakt',
				coinDecimals: 6,
				coinGeckoId: 'akash-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/akt.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'AKT',
				coinMinimalDenom: 'uakt',
				coinDecimals: 6,
				coinGeckoId: 'akash-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/akt.svg',
			},
		],
		coinType: 118,
		features: ['stargate', 'ibc-transfer', 'ibc-go', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/akash/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-regen.keplr.app',
		rest: 'https://lcd-regen.keplr.app',
		chainId: 'regen-1',
		chainName: 'Regen Network',
		stakeCurrency: {
			coinDenom: 'REGEN',
			coinMinimalDenom: 'uregen',
			coinDecimals: 6,
			coinImageUrl: window.location.origin + '/public/assets/tokens/regen.png',
			coinGeckoId: 'regen',
		},
		bip44: { coinType: 118 },
		bech32Config: Bech32Address.defaultBech32Config('regen'),
		currencies: [
			{
				coinDenom: 'REGEN',
				coinMinimalDenom: 'uregen',
				coinDecimals: 6,
				coinImageUrl: window.location.origin + '/public/assets/tokens/regen.png',
				coinGeckoId: 'regen',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'REGEN',
				coinMinimalDenom: 'uregen',
				coinDecimals: 6,
				coinImageUrl: window.location.origin + '/public/assets/tokens/regen.png',
				coinGeckoId: 'regen',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://regen.aneka.io/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-sentinel.keplr.app',
		rest: 'https://lcd-sentinel.keplr.app',
		chainId: 'sentinelhub-2',
		chainName: 'Sentinel',
		stakeCurrency: {
			coinDenom: 'DVPN',
			coinMinimalDenom: 'udvpn',
			coinDecimals: 6,
			coinGeckoId: 'sentinel',
			coinImageUrl: window.location.origin + '/public/assets/tokens/dvpn.png',
		},
		bip44: { coinType: 118 },
		bech32Config: Bech32Address.defaultBech32Config('sent'),
		currencies: [
			{
				coinDenom: 'DVPN',
				coinMinimalDenom: 'udvpn',
				coinDecimals: 6,
				coinGeckoId: 'sentinel',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dvpn.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'DVPN',
				coinMinimalDenom: 'udvpn',
				coinDecimals: 6,
				coinGeckoId: 'sentinel',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dvpn.png',
			},
		],
		explorerUrlToTx: 'https://www.mintscan.io/sentinel/txs/{txHash}',
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
	},
	{
		rpc: 'https://rpc-persistence.keplr.app',
		rest: 'https://lcd-persistence.keplr.app',
		chainId: 'core-1',
		chainName: 'Persistence',
		stakeCurrency: {
			coinDenom: 'XPRT',
			coinMinimalDenom: 'uxprt',
			coinDecimals: 6,
			coinGeckoId: 'persistence',
			coinImageUrl: window.location.origin + '/public/assets/tokens/xprt.png',
		},
		bip44: {
			coinType: 750,
		},
		bech32Config: Bech32Address.defaultBech32Config('persistence'),
		currencies: [
			{
				coinDenom: 'XPRT',
				coinMinimalDenom: 'uxprt',
				coinDecimals: 6,
				coinGeckoId: 'persistence',
				coinImageUrl: window.location.origin + '/public/assets/tokens/xprt.png',
			},
			{
				coinDenom: 'PSTAKE',
				coinMinimalDenom: 'ibc/A6E3AF63B3C906416A9AF7A556C59EA4BD50E617EFFE6299B99700CCB780E444',
				coinDecimals: 18,
				coinGeckoId: 'pstake-finance',
				coinImageUrl: window.location.origin + '/public/assets/tokens/pstake.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'XPRT',
				coinMinimalDenom: 'uxprt',
				coinDecimals: 6,
				coinGeckoId: 'persistence',
				coinImageUrl: window.location.origin + '/public/assets/tokens/xprt.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://www.mintscan.io/persistence/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-iris.keplr.app',
		rest: 'https://lcd-iris.keplr.app',
		chainId: 'irishub-1',
		chainName: 'IRISnet',
		stakeCurrency: {
			coinDenom: 'IRIS',
			coinMinimalDenom: 'uiris',
			coinDecimals: 6,
			coinGeckoId: 'iris-network',
			coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('iaa'),
		currencies: [
			{
				coinDenom: 'IRIS',
				coinMinimalDenom: 'uiris',
				coinDecimals: 6,
				coinGeckoId: 'iris-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'IRIS',
				coinMinimalDenom: 'uiris',
				coinDecimals: 6,
				coinGeckoId: 'iris-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/iris/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-crypto-org.keplr.app/',
		rest: 'https://lcd-crypto-org.keplr.app/',
		chainId: 'crypto-org-chain-mainnet-1',
		chainName: 'Crypto.org',
		stakeCurrency: {
			coinDenom: 'CRO',
			coinMinimalDenom: 'basecro',
			coinDecimals: 8,
			coinGeckoId: 'crypto-com-chain',
			coinImageUrl: window.location.origin + '/public/assets/tokens/cro.png',
		},
		bip44: {
			coinType: 394,
		},
		bech32Config: Bech32Address.defaultBech32Config('cro'),
		currencies: [
			{
				coinDenom: 'CRO',
				coinMinimalDenom: 'basecro',
				coinDecimals: 8,
				coinGeckoId: 'crypto-com-chain',
				coinImageUrl: window.location.origin + '/public/assets/tokens/cro.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'CRO',
				coinMinimalDenom: 'basecro',
				coinDecimals: 8,
				coinGeckoId: 'crypto-com-chain',
				coinImageUrl: window.location.origin + '/public/assets/tokens/cro.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/crypto-org/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-iov.keplr.app',
		rest: 'https://lcd-iov.keplr.app',
		chainId: 'iov-mainnet-ibc',
		chainName: 'Starname',
		stakeCurrency: {
			coinDenom: 'IOV',
			coinMinimalDenom: 'uiov',
			coinDecimals: 6,
			coinGeckoId: 'starname',
			coinImageUrl: window.location.origin + '/public/assets/tokens/iov.png',
		},
		bip44: {
			coinType: 234,
		},
		bech32Config: Bech32Address.defaultBech32Config('star'),
		currencies: [
			{
				coinDenom: 'IOV',
				coinMinimalDenom: 'uiov',
				coinDecimals: 6,
				coinGeckoId: 'starname',
				coinImageUrl: window.location.origin + '/public/assets/tokens/iov.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'IOV',
				coinMinimalDenom: 'uiov',
				coinDecimals: 6,
				coinGeckoId: 'starname',
				coinImageUrl: window.location.origin + '/public/assets/tokens/iov.png',
			},
		],
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://www.mintscan.io/starname/txs/{txHash}',
	},
	{
		rpc: 'https://rpc-emoney.keplr.app',
		rest: 'https://lcd-emoney.keplr.app',
		chainId: 'emoney-3',
		chainName: 'e-Money',
		stakeCurrency: {
			coinDenom: 'NGM',
			coinMinimalDenom: 'ungm',
			coinDecimals: 6,
			coinGeckoId: 'e-money',
			coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('emoney'),
		currencies: [
			{
				coinDenom: 'NGM',
				coinMinimalDenom: 'ungm',
				coinDecimals: 6,
				coinGeckoId: 'e-money',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
			},
			{
				coinDenom: 'EEUR',
				coinMinimalDenom: 'eeur',
				coinDecimals: 6,
				coinGeckoId: 'e-money-eur',
				coinImageUrl: window.location.origin + '/public/assets/tokens/eeur.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'NGM',
				coinMinimalDenom: 'ungm',
				coinDecimals: 6,
				coinGeckoId: 'e-money',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
			},
		],
		gasPriceStep: {
			low: 1,
			average: 1,
			high: 1,
		},
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://emoney.bigdipper.live/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc-juno.keplr.app',
		rest: 'https://lcd-juno.keplr.app',
		chainId: 'juno-1',
		chainName: 'Juno',
		stakeCurrency: {
			coinDenom: 'JUNO',
			coinMinimalDenom: 'ujuno',
			coinDecimals: 6,
			coinGeckoId: 'juno-network',
			coinImageUrl: window.location.origin + '/public/assets/tokens/juno.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('juno'),
		currencies: [
			{
				coinDenom: 'JUNO',
				coinMinimalDenom: 'ujuno',
				coinDecimals: 6,
				coinGeckoId: 'juno-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/juno.svg',
			},
			{
				type: 'cw20',
				contractAddress: 'juno168ctmpyppk90d34p3jjy658zf5a5l3w8wk35wht6ccqj4mr0yv8s4j5awr',
				coinDenom: 'NETA',
				coinMinimalDenom: 'cw20:juno168ctmpyppk90d34p3jjy658zf5a5l3w8wk35wht6ccqj4mr0yv8s4j5awr:NETA',
				coinDecimals: 6,
				coinGeckoId: 'neta',
				coinImageUrl: window.location.origin + '/public/assets/tokens/neta.svg',
			},
			{
				type: 'cw20',
				contractAddress: 'juno1g2g7ucurum66d42g8k5twk34yegdq8c82858gz0tq2fc75zy7khssgnhjl',
				coinDenom: 'MARBLE',
				coinMinimalDenom: 'cw20:juno1g2g7ucurum66d42g8k5twk34yegdq8c82858gz0tq2fc75zy7khssgnhjl:MARBLE',
				coinDecimals: 3,
				coinGeckoId: 'pool:marble',
				coinImageUrl: window.location.origin + '/public/assets/tokens/marble.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'JUNO',
				coinMinimalDenom: 'ujuno',
				coinDecimals: 6,
				coinGeckoId: 'juno-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/juno.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'ibc-go', 'no-legacy-stdTx', 'wasmd_0.24+'],
		explorerUrlToTx: 'https://www.mintscan.io/juno/txs/{txHash}',
	},
	{
		rpc: 'https://mainnet-node.like.co/rpc',
		rest: 'https://mainnet-node.like.co',
		chainId: 'likecoin-mainnet-2',
		chainName: 'LikeCoin',
		stakeCurrency: {
			coinDenom: 'LIKE',
			coinMinimalDenom: 'nanolike',
			coinDecimals: 9,
			coinGeckoId: 'likecoin',
			coinImageUrl: window.location.origin + '/public/assets/tokens/like.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('cosmos'),
		currencies: [
			{
				coinDenom: 'LIKE',
				coinMinimalDenom: 'nanolike',
				coinDecimals: 9,
				coinGeckoId: 'likecoin',
				coinImageUrl: window.location.origin + '/public/assets/tokens/like.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'LIKE',
				coinMinimalDenom: 'nanolike',
				coinDecimals: 9,
				coinGeckoId: 'likecoin',
				coinImageUrl: window.location.origin + '/public/assets/tokens/like.svg',
			},
		],
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://likecoin.bigdipper.live/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc-impacthub.keplr.app',
		rest: 'https://lcd-impacthub.keplr.app',
		chainId: 'impacthub-3',
		chainName: 'IXO',
		stakeCurrency: {
			coinDenom: 'IXO',
			coinMinimalDenom: 'uixo',
			coinDecimals: 6,
			coinGeckoId: 'pool:uixo',
			coinImageUrl: window.location.origin + '/public/assets/tokens/ixo.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('ixo'),
		currencies: [
			{
				coinDenom: 'IXO',
				coinMinimalDenom: 'uixo',
				coinDecimals: 6,
				coinGeckoId: 'pool:uixo',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ixo.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'IXO',
				coinMinimalDenom: 'uixo',
				coinDecimals: 6,
				coinGeckoId: 'pool:uixo',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ixo.png',
			},
		],
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://blockscan.ixo.world/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc.bitcanna.io',
		rest: 'https://lcd.bitcanna.io',
		chainId: 'bitcanna-1',
		chainName: 'BitCanna',
		stakeCurrency: {
			coinDenom: 'BCNA',
			coinMinimalDenom: 'ubcna',
			coinDecimals: 6,
			coinGeckoId: 'bitcanna',
			coinImageUrl: window.location.origin + '/public/assets/tokens/bcna.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('bcna'),
		currencies: [
			{
				coinDenom: 'BCNA',
				coinMinimalDenom: 'ubcna',
				coinDecimals: 6,
				coinGeckoId: 'bitcanna',
				coinImageUrl: window.location.origin + '/public/assets/tokens/bcna.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'BCNA',
				coinMinimalDenom: 'ubcna',
				coinDecimals: 6,
				coinGeckoId: 'bitcanna',
				coinImageUrl: window.location.origin + '/public/assets/tokens/bcna.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/bitcanna/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.explorebitsong.com',
		rest: 'https://lcd.explorebitsong.com',
		chainId: 'bitsong-2b',
		chainName: 'BitSong',
		stakeCurrency: {
			coinDenom: 'BTSG',
			coinMinimalDenom: 'ubtsg',
			coinDecimals: 6,
			coinGeckoId: 'pool:ubtsg',
			coinImageUrl: window.location.origin + '/public/assets/tokens/btsg.svg',
		},
		bip44: {
			coinType: 639,
		},
		bech32Config: Bech32Address.defaultBech32Config('bitsong'),
		currencies: [
			{
				coinDenom: 'BTSG',
				coinMinimalDenom: 'ubtsg',
				coinDecimals: 6,
				coinGeckoId: 'pool:ubtsg',
				coinImageUrl: window.location.origin + '/public/assets/tokens/btsg.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'BTSG',
				coinMinimalDenom: 'ubtsg',
				coinDecimals: 6,
				coinGeckoId: 'pool:ubtsg',
				coinImageUrl: window.location.origin + '/public/assets/tokens/btsg.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://explorebitsong.com/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc-mainnet.blockchain.ki',
		rest: 'https://api-mainnet.blockchain.ki',
		chainId: 'kichain-2',
		chainName: 'Ki',
		stakeCurrency: {
			coinDenom: 'XKI',
			coinMinimalDenom: 'uxki',
			coinDecimals: 6,
			coinGeckoId: 'pool:uxki',
			coinImageUrl: window.location.origin + '/public/assets/tokens/xki.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('ki'),
		currencies: [
			{
				coinDenom: 'XKI',
				coinMinimalDenom: 'uxki',
				coinDecimals: 6,
				coinGeckoId: 'pool:uxki',
				coinImageUrl: window.location.origin + '/public/assets/tokens/xki.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'XKI',
				coinMinimalDenom: 'uxki',
				coinDecimals: 6,
				coinGeckoId: 'pool:uxki',
				coinImageUrl: window.location.origin + '/public/assets/tokens/xki.svg',
			},
		],
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://www.mintscan.io/ki-chain/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.gopanacea.org',
		rest: 'https://api.gopanacea.org',
		chainId: 'panacea-3',
		chainName: 'MediBloc',
		stakeCurrency: {
			coinDenom: 'MED',
			coinMinimalDenom: 'umed',
			coinDecimals: 6,
			coinGeckoId: 'medibloc',
			coinImageUrl: window.location.origin + '/public/assets/tokens/med.png',
		},
		bip44: {
			coinType: 371,
		},
		bech32Config: Bech32Address.defaultBech32Config('panacea'),
		currencies: [
			{
				coinDenom: 'MED',
				coinMinimalDenom: 'umed',
				coinDecimals: 6,
				coinGeckoId: 'medibloc',
				coinImageUrl: window.location.origin + '/public/assets/tokens/med.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'MED',
				coinMinimalDenom: 'umed',
				coinDecimals: 6,
				coinGeckoId: 'medibloc',
				coinImageUrl: window.location.origin + '/public/assets/tokens/med.png',
			},
		],
		gasPriceStep: {
			low: 5,
			average: 7,
			high: 9,
		},
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://www.mintscan.io/medibloc/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.bostrom.cybernode.ai',
		rest: 'https://lcd.bostrom.cybernode.ai',
		chainId: 'bostrom',
		chainName: 'Bostrom',
		stakeCurrency: {
			coinDenom: 'BOOT',
			coinMinimalDenom: 'boot',
			coinDecimals: 0,
			coinGeckoId: 'bostrom',
			coinImageUrl: window.location.origin + '/public/assets/tokens/boot.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('bostrom'),
		currencies: [
			{
				coinDenom: 'BOOT',
				coinMinimalDenom: 'boot',
				coinDecimals: 0,
				coinGeckoId: 'bostrom',
				coinImageUrl: window.location.origin + '/public/assets/tokens/boot.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'BOOT',
				coinMinimalDenom: 'boot',
				coinDecimals: 0,
				coinGeckoId: 'bostrom',
				coinImageUrl: window.location.origin + '/public/assets/tokens/boot.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://cyb.ai/network/bostrom/tx/{txHash}',
	},
	{
		rpc: 'https://rpc.comdex.one',
		rest: 'https://rest.comdex.one',
		chainId: 'comdex-1',
		chainName: 'Comdex',
		stakeCurrency: {
			coinDenom: 'CMDX',
			coinMinimalDenom: 'ucmdx',
			coinDecimals: 6,
			coinGeckoId: 'comdex',
			coinImageUrl: window.location.origin + '/public/assets/tokens/cmdx.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('comdex'),
		currencies: [
			{
				coinDenom: 'CMDX',
				coinMinimalDenom: 'ucmdx',
				coinDecimals: 6,
				coinGeckoId: 'comdex',
				coinImageUrl: window.location.origin + '/public/assets/tokens/cmdx.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'CMDX',
				coinMinimalDenom: 'ucmdx',
				coinDecimals: 6,
				coinGeckoId: 'comdex',
				coinImageUrl: window.location.origin + '/public/assets/tokens/cmdx.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/comdex/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.cheqd.net',
		rest: 'https://api.cheqd.net',
		chainId: 'cheqd-mainnet-1',
		chainName: 'cheqd',
		stakeCurrency: {
			coinDenom: 'CHEQ',
			coinMinimalDenom: 'ncheq',
			coinDecimals: 9,
			coinGeckoId: 'cheqd-network',
			coinImageUrl: window.location.origin + '/public/assets/tokens/cheq.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('cheqd'),
		currencies: [
			{
				coinDenom: 'CHEQ',
				coinMinimalDenom: 'ncheq',
				coinDecimals: 9,
				coinGeckoId: 'cheqd-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/cheq.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'CHEQ',
				coinMinimalDenom: 'ncheq',
				coinDecimals: 9,
				coinGeckoId: 'cheqd-network',
				coinImageUrl: window.location.origin + '/public/assets/tokens/cheq.svg',
			},
		],
		gasPriceStep: {
			low: 25,
			average: 30,
			high: 50,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://explorer.cheqd.io/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc.stargaze-apis.com',
		rest: 'https://rest.stargaze-apis.com',
		chainId: 'stargaze-1',
		chainName: 'Stargaze',
		stakeCurrency: {
			coinDenom: 'STARS',
			coinMinimalDenom: 'ustars',
			coinDecimals: 6,
			coinGeckoId: 'pool:ustars',
			coinImageUrl: window.location.origin + '/public/assets/tokens/stars.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('stars'),
		currencies: [
			{
				coinDenom: 'STARS',
				coinMinimalDenom: 'ustars',
				coinDecimals: 6,
				coinGeckoId: 'pool:ustars',
				coinImageUrl: window.location.origin + '/public/assets/tokens/stars.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'STARS',
				coinMinimalDenom: 'ustars',
				coinDecimals: 6,
				coinGeckoId: 'pool:ustars',
				coinImageUrl: window.location.origin + '/public/assets/tokens/stars.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/stargaze/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.chihuahua.wtf',
		rest: 'https://api.chihuahua.wtf',
		chainId: 'chihuahua-1',
		chainName: 'Chihuahua',
		stakeCurrency: {
			coinDenom: 'HUAHUA',
			coinMinimalDenom: 'uhuahua',
			coinDecimals: 6,
			coinGeckoId: 'pool:uhuahua',
			coinImageUrl: window.location.origin + '/public/assets/tokens/huahua.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('chihuahua'),
		currencies: [
			{
				coinDenom: 'HUAHUA',
				coinMinimalDenom: 'uhuahua',
				coinDecimals: 6,
				coinGeckoId: 'pool:uhuahua',
				coinImageUrl: window.location.origin + '/public/assets/tokens/huahua.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'HUAHUA',
				coinMinimalDenom: 'uhuahua',
				coinDecimals: 6,
				coinGeckoId: 'pool:uhuahua',
				coinImageUrl: window.location.origin + '/public/assets/tokens/huahua.png',
			},
		],
		gasPriceStep: {
			low: 0.025,
			average: 0.03,
			high: 0.035,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://ping.pub/chihuahua/tx/{txHash}',
	},
	{
		rpc: 'https://node0.mainnet.lum.network/rpc',
		rest: 'https://node0.mainnet.lum.network/rest',
		chainId: 'lum-network-1',
		chainName: 'Lum Network',
		stakeCurrency: {
			coinDenom: 'LUM',
			coinMinimalDenom: 'ulum',
			coinDecimals: 6,
			coinGeckoId: 'pool:ulum',
			coinImageUrl: window.location.origin + '/public/assets/tokens/lum.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('lum'),
		currencies: [
			{
				coinDenom: 'LUM',
				coinMinimalDenom: 'ulum',
				coinDecimals: 6,
				coinGeckoId: 'pool:ulum',
				coinImageUrl: window.location.origin + '/public/assets/tokens/lum.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'LUM',
				coinMinimalDenom: 'ulum',
				coinDecimals: 6,
				coinGeckoId: 'pool:ulum',
				coinImageUrl: window.location.origin + '/public/assets/tokens/lum.svg',
			},
		],
		coinType: 118,
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://www.mintscan.io/lum/txs/{txHash}',
	},
	{
		rpc: 'https://mainnet-rpc.vidulum.app',
		rest: 'https://mainnet-lcd.vidulum.app',
		chainId: 'vidulum-1',
		chainName: 'Vidulum',
		stakeCurrency: {
			coinDenom: 'VDL',
			coinMinimalDenom: 'uvdl',
			coinDecimals: 6,
			coinGeckoId: 'vidulum',
			coinImageUrl: window.location.origin + '/public/assets/tokens/vdl.svg',
		},
		bip44: {
			coinType: 370,
		},
		bech32Config: Bech32Address.defaultBech32Config('vdl'),
		currencies: [
			{
				coinDenom: 'VDL',
				coinMinimalDenom: 'uvdl',
				coinDecimals: 6,
				coinGeckoId: 'vidulum',
				coinImageUrl: window.location.origin + '/public/assets/tokens/vdl.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'VDL',
				coinMinimalDenom: 'uvdl',
				coinDecimals: 6,
				coinGeckoId: 'vidulum',
				coinImageUrl: window.location.origin + '/public/assets/tokens/vdl.svg',
			},
		],
		coinType: 370,
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://explorers.vidulum.app/vidulum/tx/{txHash}',
	},
	{
		rpc: 'https://rpc.mainnet.desmos.network',
		rest: 'https://api.mainnet.desmos.network',
		chainId: 'desmos-mainnet',
		chainName: 'Desmos',
		stakeCurrency: {
			coinDenom: 'DSM',
			coinMinimalDenom: 'udsm',
			coinDecimals: 6,
			coinGeckoId: 'pool:udsm',
			coinImageUrl: window.location.origin + '/public/assets/tokens/dsm.svg',
		},
		bip44: {
			coinType: 852,
		},
		bech32Config: Bech32Address.defaultBech32Config('desmos'),
		currencies: [
			{
				coinDenom: 'DSM',
				coinMinimalDenom: 'udsm',
				coinDecimals: 6,
				coinGeckoId: 'pool:udsm',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dsm.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'DSM',
				coinMinimalDenom: 'udsm',
				coinDecimals: 6,
				coinGeckoId: 'pool:udsm',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dsm.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://explorer.desmos.network/transactions/{txHash}',
	},
	{
		rpc: 'https://rpc-1-dig.notional.ventures',
		rest: 'https://api-1-dig.notional.ventures',
		chainId: 'dig-1',
		chainName: 'Dig',
		stakeCurrency: {
			coinDenom: 'DIG',
			coinMinimalDenom: 'udig',
			coinDecimals: 6,
			coinGeckoId: 'pool:udig',
			coinImageUrl: window.location.origin + '/public/assets/tokens/dig.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('dig'),
		currencies: [
			{
				coinDenom: 'DIG',
				coinMinimalDenom: 'udig',
				coinDecimals: 6,
				coinGeckoId: 'pool:udig',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dig.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'DIG',
				coinMinimalDenom: 'udig',
				coinDecimals: 6,
				coinGeckoId: 'pool:udig',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dig.png',
			},
		],
		gasPriceStep: {
			low: 0.025,
			average: 0.03,
			high: 0.035,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://ping.pub/dig/tx/{txHash}',
	},
	{
		rpc: 'https://rpc-sommelier.keplr.app',
		rest: 'https://lcd-sommelier.keplr.app',
		chainId: 'sommelier-3',
		chainName: 'Sommelier',
		stakeCurrency: {
			coinDenom: 'SOMM',
			coinMinimalDenom: 'usomm',
			coinDecimals: 6,
			coinGeckoId: 'pool:usomm',
			coinImageUrl: window.location.origin + '/public/assets/tokens/somm.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('somm'),
		currencies: [
			{
				coinDenom: 'SOMM',
				coinMinimalDenom: 'usomm',
				coinDecimals: 6,
				coinGeckoId: 'pool:usomm',
				coinImageUrl: window.location.origin + '/public/assets/tokens/somm.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'SOMM',
				coinMinimalDenom: 'usomm',
				coinDecimals: 6,
				coinGeckoId: 'pool:usomm',
				coinImageUrl: window.location.origin + '/public/assets/tokens/somm.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://sommscan.io',
	},
	{
		rpc: 'https://rpc.sifchain.finance',
		rest: 'https://api-int.sifchain.finance',
		chainId: 'sifchain-1',
		chainName: 'Sifchain',
		stakeCurrency: {
			coinDenom: 'ROWAN',
			coinMinimalDenom: 'rowan',
			coinDecimals: 18,
			coinGeckoId: 'sifchain',
			coinImageUrl: window.location.origin + '/public/assets/tokens/rowan.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('sif'),
		currencies: [
			{
				coinDenom: 'ROWAN',
				coinMinimalDenom: 'rowan',
				coinDecimals: 18,
				coinGeckoId: 'sifchain',
				coinImageUrl: window.location.origin + '/public/assets/tokens/rowan.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'ROWAN',
				coinMinimalDenom: 'rowan',
				coinDecimals: 18,
				coinGeckoId: 'sifchain',
				coinImageUrl: window.location.origin + '/public/assets/tokens/rowan.svg',
			},
		],
		features: ['stargate', 'ibc-transfer'],
		explorerUrlToTx: 'https://www.mintscan.io/sifchain/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.laozi3.bandchain.org',
		rest: 'https://laozi1.bandchain.org/api',
		chainId: 'laozi-mainnet',
		chainName: 'BandChain',
		stakeCurrency: {
			coinDenom: 'BAND',
			coinMinimalDenom: 'uband',
			coinDecimals: 6,
			coinGeckoId: 'band-protocol',
			coinImageUrl: window.location.origin + '/public/assets/tokens/band.svg',
		},
		bip44: {
			coinType: 494,
		},
		bech32Config: Bech32Address.defaultBech32Config('band'),
		currencies: [
			{
				coinDenom: 'BAND',
				coinMinimalDenom: 'uband',
				coinDecimals: 6,
				coinGeckoId: 'band-protocol',
				coinImageUrl: window.location.origin + '/public/assets/tokens/band.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'BAND',
				coinMinimalDenom: 'uband',
				coinDecimals: 6,
				coinGeckoId: 'band-protocol',
				coinImageUrl: window.location.origin + '/public/assets/tokens/band.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://cosmoscan.io/tx/{txHash}',
	},
	{
		rpc: 'https://node1.konstellation.tech:26657',
		rest: 'https://node1.konstellation.tech:1318',
		chainId: 'darchub',
		chainName: 'Konstellation',
		stakeCurrency: {
			coinDenom: 'DARC',
			coinMinimalDenom: 'udarc',
			coinDecimals: 6,
			coinGeckoId: 'pool:udarc',
			coinImageUrl: window.location.origin + '/public/assets/tokens/darc.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('darc'),
		currencies: [
			{
				coinDenom: 'DARC',
				coinMinimalDenom: 'udarc',
				coinDecimals: 6,
				coinGeckoId: 'pool:udarc',
				coinImageUrl: window.location.origin + '/public/assets/tokens/darc.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'DARC',
				coinMinimalDenom: 'udarc',
				coinDecimals: 6,
				coinGeckoId: 'pool:udarc',
				coinImageUrl: window.location.origin + '/public/assets/tokens/darc.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/konstellation/txs/{txHash}',
	},
	{
		rpc: 'https://rpc.aphrodite.main.network.umee.cc',
		rest: 'https://api.aphrodite.main.network.umee.cc',
		chainId: 'umee-1',
		chainName: 'Umee',
		stakeCurrency: {
			coinDenom: 'UMEE',
			coinMinimalDenom: 'uumee',
			coinDecimals: 6,
			coinGeckoId: 'pool:uumee',
			coinImageUrl: window.location.origin + '/public/assets/tokens/umee.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('umee'),
		currencies: [
			{
				coinDenom: 'UMEE',
				coinMinimalDenom: 'uumee',
				coinDecimals: 6,
				coinGeckoId: 'pool:uumee',
				coinImageUrl: window.location.origin + '/public/assets/tokens/umee.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'UMEE',
				coinMinimalDenom: 'uumee',
				coinDecimals: 6,
				coinGeckoId: 'pool:uumee',
				coinImageUrl: window.location.origin + '/public/assets/tokens/umee.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://www.mintscan.io/umee/txs/{txHash}',
	},
	{
		rpc: 'https://gravitychain.io:26657',
		rest: 'https://gravitychain.io:1317',
		chainId: 'gravity-bridge-3',
		chainName: 'Gravity Bridge',
		stakeCurrency: {
			coinDenom: 'GRAV',
			coinMinimalDenom: 'ugraviton',
			coinDecimals: 6,
			coinGeckoId: 'pool:ugraviton',
			coinImageUrl: window.location.origin + '/public/assets/tokens/grav.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('gravity'),
		currencies: [
			{
				coinDenom: 'GRAV',
				coinMinimalDenom: 'ugraviton',
				coinDecimals: 6,
				coinGeckoId: 'pool:ugraviton',
				coinImageUrl: window.location.origin + '/public/assets/tokens/grav.svg',
			},
			{
				coinDenom: 'PSTAKE',
				coinMinimalDenom: 'gravity0xfB5c6815cA3AC72Ce9F5006869AE67f18bF77006',
				coinDecimals: 18,
				coinGeckoId: 'pstake-finance',
				coinImageUrl: window.location.origin + '/public/assets/tokens/pstake.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'GRAV',
				coinMinimalDenom: 'ugraviton',
				coinDecimals: 6,
				coinGeckoId: 'pool:ugraviton',
				coinImageUrl: window.location.origin + '/public/assets/tokens/grav.svg',
			},
		],
		gasPriceStep: {
			low: 0,
			average: 0,
			high: 0.035,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://www.mintscan.io/gravity-bridge/txs/{txHash}',
	},
	{
		rpc: 'https://poseidon.mainnet.decentr.xyz',
		rest: 'https://rest.mainnet.decentr.xyz',
		chainId: 'mainnet-3',
		chainName: 'Decentr',
		stakeCurrency: {
			coinDenom: 'DEC',
			coinMinimalDenom: 'udec',
			coinDecimals: 6,
			coinGeckoId: 'decentr',
			coinImageUrl: window.location.origin + '/public/assets/tokens/dec.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('decentr'),
		currencies: [
			{
				coinDenom: 'DEC',
				coinMinimalDenom: 'udec',
				coinDecimals: 6,
				coinGeckoId: 'decentr',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dec.svg',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'DEC',
				coinMinimalDenom: 'udec',
				coinDecimals: 6,
				coinGeckoId: 'decentr',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dec.svg',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx'],
		explorerUrlToTx: 'https://explorer.decentr.net/transactions/{txHash}?networkId=mainnet',
	},
	{
		rpc: 'https://tm-api.carbon.network',
		rest: 'https://api.carbon.network',
		chainId: 'carbon-1',
		chainName: 'Carbon',
		stakeCurrency: {
			coinDenom: 'SWTH',
			coinMinimalDenom: 'swth',
			coinDecimals: 8,
			coinGeckoId: 'switcheo',
			coinImageUrl: window.location.origin + '/public/assets/tokens/swth.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('swth'),
		currencies: [
			{
				coinDenom: 'SWTH',
				coinMinimalDenom: 'swth',
				coinDecimals: 8,
				coinGeckoId: 'switcheo',
				coinImageUrl: window.location.origin + '/public/assets/tokens/swth.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'SWTH',
				coinMinimalDenom: 'swth',
				coinDecimals: 8,
				coinGeckoId: 'switcheo',
				coinImageUrl: window.location.origin + '/public/assets/tokens/swth.png',
			},
		],
		gasPriceStep: {
			low: 769.23077,
			average: 769.23077,
			high: 769.23077,
		},
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://scan.carbon.network/transaction/{txHash}?net=main',
	},
	{
		rpc: 'https://rpc.cerberus.zone:26657',
		rest: 'https://api.cerberus.zone:1317',
		chainId: 'cerberus-chain-1',
		chainName: 'Cerberus',
		stakeCurrency: {
			coinDenom: 'CRBRUS',
			coinMinimalDenom: 'ucrbrus',
			coinDecimals: 6,
			coinGeckoId: 'cerberus-2',
			coinImageUrl: window.location.origin + '/public/assets/tokens/crbrus.png',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('cerberus'),
		currencies: [
			{
				coinDenom: 'CRBRUS',
				coinMinimalDenom: 'ucrbrus',
				coinDecimals: 6,
				coinGeckoId: 'cerberus-2',
				coinImageUrl: window.location.origin + '/public/assets/tokens/crbrus.png',
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'CRBRUS',
				coinMinimalDenom: 'ucrbrus',
				coinDecimals: 6,
				coinGeckoId: 'cerberus-2',
				coinImageUrl: window.location.origin + '/public/assets/tokens/crbrus.png',
			},
		],
		features: ['stargate', 'ibc-transfer', 'no-legacy-stdTx', 'ibc-go'],
		explorerUrlToTx: 'https://skynetexplorers.com/Cerberus/tx/{txHash}',
	},
];
