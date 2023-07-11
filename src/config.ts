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

const TechneCoin = {
	coinDenom: 'TECHNE',
	coinMinimalDenom: 'techne',
	coinDecimals: 18,
	coinGeckoId: 'techne',
	coinImageUrl: window.location.origin + '/public/assets/tokens/techne.png',
	contractAddress: '0x16B4975206628BCd6Fa0F1Abc87c4594439C58Cb',
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
			TechneCoin,
			{
				coinDenom: 'OSMO',
				coinMinimalDenom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
				coinDecimals: 6,
				coinGeckoId: 'osmosis',
				coinImageUrl: window.location.origin + '/public/assets/tokens/osmo.svg',
			},
			{
				coinDenom: 'axlUSDC',
				coinMinimalDenom: 'ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F',
				coinDecimals: 6,
				coinGeckoId: 'axlUSDC',
				coinImageUrl: window.location.origin + '/public/assets/tokens/usdc.svg',
			},
			{
				coinDenom: 'axlETH',
				coinMinimalDenom: 'ibc/1B38805B1C75352B28169284F96DF56BDEBD9E8FAC005BDCC8CF0378C82AA8E7',
				coinDecimals: 18,
				coinGeckoId: 'axlETH',
				coinImageUrl: window.location.origin + '/public/assets/tokens/eth.svg',
			},
			{
				coinDenom: 'axlDAI',
				coinMinimalDenom: 'ibc/3914BDEF46F429A26917E4D8D434620EC4817DC6B6E68FB327E190902F1E9242',
				coinDecimals: 18,
				coinGeckoId: 'axlDAI',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dai.svg',
			},
			{
				coinDenom: 'axlUSDT',
				coinMinimalDenom: 'ibc/F2331645B9683116188EF36FC04A809C28BD36B54555E8705A37146D0182F045',
				coinDecimals: 6,
				coinGeckoId: 'axlUSDT',
				coinImageUrl: window.location.origin + '/public/assets/tokens/usdt.png',
			},
			{
				coinDenom: 'axlWBTC',
				coinMinimalDenom: 'ibc/301DAF9CB0A9E247CD478533EF0E21F48FF8118C4A51F77C8BC3EB70E5566DBC',
				coinDecimals: 8,
				coinGeckoId: 'axlWBTC',
				coinImageUrl: window.location.origin + '/public/assets/tokens/wbtc.png',
			},
			{
				coinDenom: 'axlMATIC',
				coinMinimalDenom: 'ibc/A64467480BBE4CCFC3CF7E25AD1446AA9BDBD4F5BCB9EF6038B83D6964C784E6',
				coinDecimals: 18,
				coinGeckoId: 'axlMATIC',
				coinImageUrl: window.location.origin + '/public/assets/tokens/matic.svg',
			},
			{
				coinDenom: 'axlDOT',
				coinMinimalDenom: 'ibc/B37E4D9FB5B30F3E1E20A4B2DE2A005E584C5C822C44527546556AE2470B4539',
				coinDecimals: 10,
				coinGeckoId: 'axlDOT',
				coinImageUrl: window.location.origin + '/public/assets/tokens/dot.svg',
			},
			{
				coinDenom: 'axlAVAX',
				coinMinimalDenom: 'ibc/004EBF085BBED1029326D56BE8A2E67C08CECE670A94AC1947DF413EF5130EB2',
				coinDecimals: 18,
				coinGeckoId: 'axlAVAX',
				coinImageUrl: window.location.origin + '/public/assets/tokens/avax.svg',
			},
			{
				coinDenom: 'axlBNB',
				coinMinimalDenom: 'ibc/DADB399E742FCEE71853E98225D13E44E90292852CD0033DF5CABAB96F80B833',
				coinDecimals: 18,
				coinGeckoId: 'axlBNB',
				coinImageUrl: window.location.origin + '/public/assets/tokens/bnb.svg',
			},
			{
				coinDenom: 'axlBUSD',
				coinMinimalDenom: 'ibc/65CD60D7E37EF830BC6B6A6DF4E3E3884A96C0905A7D271C48DC0440B1989EC7',
				coinDecimals: 18,
				coinGeckoId: 'axlBUSD',
				coinImageUrl: window.location.origin + '/public/assets/tokens/busd.svg',
			},
			{
				coinDenom: 'axlFTM',
				coinMinimalDenom: 'ibc/E67ADA2204A941CD4743E70771BA08E24885E1ADD6FD140CE1F9E0FEBB68C6B2',
				coinDecimals: 18,
				coinGeckoId: 'axlFTM',
				coinImageUrl: window.location.origin + '/public/assets/tokens/ftm.svg',
			},
			{
				coinDenom: 'axlGLMR',
				coinMinimalDenom: 'ibc/C8D63703F5805CE6A2B20555139CF6ED9CDFA870389648EB08D688B94B0AE2C1',
				coinDecimals: 18,
				coinGeckoId: 'axlGLMR',
				coinImageUrl: window.location.origin + '/public/assets/tokens/glmr.svg',
			},
			{
				coinDenom: 'axlRAI',
				coinMinimalDenom: 'ibc/4CA23432A78B272A9EB7010CB72A15A199066D239F1B13BB583F3945EB8A315C',
				coinDecimals: 18,
				coinGeckoId: 'axlRAI',
				coinImageUrl: window.location.origin + '/public/assets/tokens/rai.svg',
			},
			{
				coinDenom: 'axlLINK',
				coinMinimalDenom: 'ibc/FC59D6840A41252352263CEA2B832BB86D68D03CBA194263CB9F3C15946796FB',
				coinDecimals: 18,
				coinGeckoId: 'axlLINK',
				coinImageUrl: window.location.origin + '/public/assets/tokens/link.svg',
			},
			{
				coinDenom: 'axlFRAX',
				coinMinimalDenom: 'ibc/7B11FE7D6385B46B9F3598B298B81A773CB20A8BA12001D87A78580314218364',
				coinDecimals: 18,
				coinGeckoId: 'axlFRAX',
				coinImageUrl: window.location.origin + '/public/assets/tokens/frax.svg',
			},
			{
				coinDenom: 'axlMKR',
				coinMinimalDenom: 'ibc/31A4E6623063E702FB9CF2E7B616DFCCDE319CA2FC4775CDFF26F29F628E7ACF',
				coinDecimals: 18,
				coinGeckoId: 'axlMKR',
				coinImageUrl: window.location.origin + '/public/assets/tokens/mkr.svg',
			},
			{
				coinDenom: 'axlUNI',
				coinMinimalDenom: 'ibc/0A88A08F3E9573DB9D8CB74AA3746F6D23C41C3EE7B6CC5AA4695A1DD74FF86B',
				coinDecimals: 18,
				coinGeckoId: 'axlUNI',
				coinImageUrl: window.location.origin + '/public/assets/tokens/uni.svg',
			},
			{
				coinDenom: 'axlSHIB',
				coinMinimalDenom: 'ibc/43BF3152103ED706E207005E7C433AB3440572C1D444FFE49321A0EF6A8EFC82',
				coinDecimals: 18,
				coinGeckoId: 'axlSHIB',
				coinImageUrl: window.location.origin + '/public/assets/tokens/shib.svg',
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
	{
		rpc: 'https://rpc-cosmoshub.keplr.app',
		rest: 'https://lcd-cosmoshub.keplr.app',
		chainId: 'cosmoshub-4',
		chainName: 'Cosmos Hub',
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('cosmos'),
		stakeCurrency: AtomCoin,
		currencies: [AtomCoin],
		feeCurrencies: [AtomCoin],
		gasPriceStep: {
			low: 0.01,
			average: 0.025,
			high: 0.03,
		},
		features: ['ibc-transfer', 'ibc-go'],
		explorerUrlToTx: 'https://www.mintscan.io/cosmos/txs/{txHash}',
	},
	{
		rpc: !isMainnet ? 'https://rpc-axelar-testnet.imperator.co:443' : 'https://rpc-axelar.keplr.app', // source: https://docs.axelar.dev/resources
		rest: !isMainnet ? 'https://lcd-axelar-testnet.imperator.co:443' : 'https://lcd-axelar.keplr.app',
		chainId: !isMainnet ? 'axelar-testnet-lisbon-3' : 'axelar-dojo-1',
		chainName: !isMainnet ? 'Axelar Testnet' : 'Axelar',
		stakeCurrency: {
			coinDenom: 'AXL',
			coinMinimalDenom: 'uaxl',
			coinDecimals: 6,
			coinGeckoId: 'axelar',
			coinImageUrl: '/tokens/axl.svg',
		},
		bip44: {
			coinType: 118,
		},
		bech32Config: Bech32Address.defaultBech32Config('axelar'),
		currencies: [],
		feeCurrencies: [
			{
				coinDenom: 'AXL',
				coinMinimalDenom: 'uaxl',
				coinDecimals: 6,
				coinGeckoId: 'axelar',
				coinImageUrl: '/tokens/axl.svg',
			},
		],
		gasPriceStep: !isMainnet
			? {
					low: 0.007,
					average: 0.007,
					high: 0.01,
			  }
			: {
					low: 0.007,
					average: 0.007,
					high: 0.01,
			  },
		features: ['ibc-transfer', 'ibc-go'],
		explorerUrlToTx: !isMainnet ? 'https://testnet.axelarscan.io/tx/{txHash}' : 'https://axelarscan.io/tx/{txHash}',
	},
];
