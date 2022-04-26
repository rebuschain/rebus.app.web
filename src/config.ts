import { Bech32Address } from '@keplr-wallet/cosmos';
import { ChainInfoWithExplorer } from './stores/chain';
import { DenomHelper } from '@keplr-wallet/common';
import { Int } from '@keplr-wallet/unit';
import env from '@beam-australia/react-env';

export const HideCreateNewPool: boolean = false;
export const HideLBPPoolFromPage: boolean = false;
export const HidePoolFromPage: {
	[poolId: string]: boolean | undefined;
} = {
	/*
	'16': window.location.hostname.startsWith('app.'),
	 */
};

export const LockupAbledPoolIds: {
	[poolId: string]: boolean | undefined;
} = {
	'1': true,
	'2': true,
	'3': true,
	'4': true,
	'5': true,
	'6': true,
	'7': true,
	'8': true,
	'9': true,
	'10': true,
	'13': true,
	'15': true,
	'461': true,
	'482': true,
	'497': true,
	'498': true,
	'548': true,
	'553': true,
	'555': true,
	'557': true,
	'558': true,
	'571': true,
	'572': true,
	'573': true,
	'574': true,
	'577': true,
	'578': true,
	'579': true,
	'584': true,
	'585': true,
	'586': true,
	'587': true,
	'592': true,
	'600': true,
	'601': true,
	'602': true,
	'604': true,
	'611': true,
	'612': true,
	'613': true,
	'617': true,
	'618': true,
	'619': true,
	'621': true,
	'629': true,
	'637': true,
	'638': true,
	'641': true,
	'642': true,
	'643': true,
	'648': true,
	'651': true,
};

export const PromotedLBPPoolIds: {
	poolId: string;
	name: string;
	baseDenom: string;
}[] = [];

export const HideAddLiquidityPoolIds: {
	[poolId: string]: boolean;
} = {
	/*
	'21': window.location.hostname.startsWith('app.'),
	 */
};
export const PreferHeaderShowTokenPricePoolIds: {
	[poolId: string]:
		| {
				baseDenom: string;
		  }
		| undefined;
} = {
	/*
	'21': {
		baseDenom: DenomHelper.ibcDenom([{ portId: 'transfer', channelId: 'channel-8' }], 'uregen'),
	},
	 */
};
export const ExtraGaugeInPool: {
	[poolId: string]:
		| {
				gaugeId: string;
				denom: string;
				extraRewardAmount?: Int;
		  }
		| {
				gaugeId: string;
				denom: string;
				extraRewardAmount?: Int;
		  }[];
} = {
	'3': [
		{
			gaugeId: '2578',
			denom: 'ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4',
		},
	],
	'461': [
		{
			gaugeId: '1774',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
		{
			gaugeId: '1775',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
		{
			gaugeId: '1776',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
	],
	'482': [
		{
			gaugeId: '1771',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
		{
			gaugeId: '1772',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
		{
			gaugeId: '1773',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
	],
	'497': [
		{
			gaugeId: '1679',
			denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
		},
		{
			gaugeId: '1680',
			denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
		},
		{
			gaugeId: '1681',
			denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
		},
	],
	'498': [
		{
			gaugeId: '1682',
			denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
		},
		{
			gaugeId: '1683',
			denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
		},
		{
			gaugeId: '1684',
			denom: 'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
		},
	],
	'548': [
		{
			gaugeId: '1676',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
		{
			gaugeId: '1677',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
		{
			gaugeId: '1678',
			denom: 'ibc/1DC495FCEFDA068A3820F903EDBD78B942FBD204D7E93D3BA2B432E9669D1A59',
		},
	],
	'553': [
		{
			gaugeId: '2257',
			denom: 'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
		},
		{
			gaugeId: '2256',
			denom: 'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
		},
		{
			gaugeId: '2255',
			denom: 'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
		},
	],
	'555': [
		{
			gaugeId: '2254',
			denom: 'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
		},
		{
			gaugeId: '2253',
			denom: 'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
		},
		{
			gaugeId: '2252',
			denom: 'ibc/9989AD6CCA39D1131523DB0617B50F6442081162294B4795E26746292467B525',
		},
	],
	'557': [
		{
			gaugeId: '1736',
			denom: 'ibc/F3FF7A84A73B62921538642F9797C423D2B4C4ACB3C7FCFFCE7F12AA69909C4B',
		},
	],
	'558': [
		{
			gaugeId: '1737',
			denom: 'ibc/F3FF7A84A73B62921538642F9797C423D2B4C4ACB3C7FCFFCE7F12AA69909C4B',
		},
	],
	'560': [
		{
			gaugeId: '1948',
			denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
		},
		{
			gaugeId: '1949',
			denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
		},
		{
			gaugeId: '1950',
			denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
		},
	],
	'562': [
		{
			gaugeId: '1951',
			denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
		},
		{
			gaugeId: '1952',
			denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
		},
		{
			gaugeId: '1953',
			denom: 'ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0',
		},
	],
	'571': [
		{
			gaugeId: '1759',
			denom: 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
		},
		{
			gaugeId: '1760',
			denom: 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
		},
		{
			gaugeId: '1761',
			denom: 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
		},
	],
	'572': [
		{
			gaugeId: '1762',
			denom: 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
		},
		{
			gaugeId: '1763',
			denom: 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
		},
		{
			gaugeId: '1764',
			denom: 'ibc/D805F1DA50D31B96E4282C1D4181EDDFB1A44A598BFF5666F4B43E4B8BEA95A5',
		},
	],
	'573': [
		{
			gaugeId: '2582',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
		{
			gaugeId: '2583',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
		{
			gaugeId: '2584',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
	],
	'574': [
		{
			gaugeId: '2585',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
		{
			gaugeId: '2586',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
		{
			gaugeId: '2587',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
	],
	'577': [
		{
			gaugeId: '2088',
			denom: 'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
		},
		{
			gaugeId: '2089',
			denom: 'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
		},
		{
			gaugeId: '2090',
			denom: 'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
		},
	],
	'578': [
		{
			gaugeId: '2091',
			denom: 'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
		},
		{
			gaugeId: '2092',
			denom: 'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
		},
		{
			gaugeId: '2093',
			denom: 'ibc/B547DC9B897E7C3AA5B824696110B8E3D2C31E3ED3F02FF363DCBAD82457E07E',
		},
	],
	'584': [
		{
			gaugeId: '1861',
			denom: 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
		},
		{
			gaugeId: '1862',
			denom: 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
		},
		{
			gaugeId: '1863',
			denom: 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
		},
	],
	'585': [
		{
			gaugeId: '1864',
			denom: 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
		},
		{
			gaugeId: '1865',
			denom: 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
		},
		{
			gaugeId: '1866',
			denom: 'ibc/0954E1C28EB7AF5B72D24F3BC2B47BBB2FDF91BDDFD57B74B99E133AED40972A',
		},
	],
	'586': [
		{
			gaugeId: '1885',
			denom: 'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
		},
		{
			gaugeId: '1886',
			denom: 'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
		},
		{
			gaugeId: '1887',
			denom: 'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
		},
	],
	'587': [
		{
			gaugeId: '1888',
			denom: 'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
		},
		{
			gaugeId: '1889',
			denom: 'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
		},
		{
			gaugeId: '1890',
			denom: 'ibc/3BCCC93AD5DF58D11A6F8A05FA8BC801CBA0BA61A981F57E91B8B598BF8061CB',
		},
	],
	'592': [
		{
			gaugeId: '2588',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
		{
			gaugeId: '2589',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
		{
			gaugeId: '2590',
			denom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
		},
	],
	'600': [
		{
			gaugeId: '2278',
			denom: 'ibc/EA3E1640F9B1532AB129A571203A0B9F789A7F14BB66E350DCBFA18E1A1931F0',
		},
		{
			gaugeId: '2279',
			denom: 'ibc/EA3E1640F9B1532AB129A571203A0B9F789A7F14BB66E350DCBFA18E1A1931F0',
		},
	],
	'601': [
		{
			gaugeId: '2276',
			denom: 'ibc/EA3E1640F9B1532AB129A571203A0B9F789A7F14BB66E350DCBFA18E1A1931F0',
		},
		{
			gaugeId: '2277',
			denom: 'ibc/EA3E1640F9B1532AB129A571203A0B9F789A7F14BB66E350DCBFA18E1A1931F0',
		},
	],
	'5': [
		{
			gaugeId: '1900',
			denom: 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
		},
		{
			gaugeId: '1901',
			denom: 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
		},
		{
			gaugeId: '1902',
			denom: 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
		},
	],
	'6': [
		{
			gaugeId: '1903',
			denom: 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
		},
		{
			gaugeId: '1904',
			denom: 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
		},
		{
			gaugeId: '1905',
			denom: 'ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84',
		},
	],
	'602': [
		{
			gaugeId: '2127',
			denom: 'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
		},
		{
			gaugeId: '2128',
			denom: 'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
		},
	],
	'604': [
		{
			gaugeId: '2912',
			denom: 'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
		},
	],
	'605': [
		{
			gaugeId: '1960',
			denom: 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
		},
		{
			gaugeId: '1961',
			denom: 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
		},
		{
			gaugeId: '1962',
			denom: 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
		},
	],
	'606': [
		{
			gaugeId: '1963',
			denom: 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
		},
		{
			gaugeId: '1964',
			denom: 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
		},
		{
			gaugeId: '1965',
			denom: 'ibc/B9E0A1A524E98BB407D3CED8720EFEFD186002F90C1B1B7964811DD0CCC12228',
		},
	],
	'611': [
		{
			gaugeId: '2913',
			denom: 'ibc/987C17B11ABC2B20019178ACE62929FE9840202CE79498E29FE8E5CB02B7C0A4',
		},
	],
	'612': [
		{
			gaugeId: '2109',
			denom: 'ibc/A0CC0CF735BFB30E730C70019D4218A1244FF383503FF7579C9201AB93CA9293',
		},
	],
	'613': [
		{
			gaugeId: '1982',
			denom: 'ibc/E7B35499CFBEB0FF5778127ABA4FB2C4B79A6B8D3D831D4379C4048C238796BD',
		},
		{
			gaugeId: '2013',
			denom: 'ibc/E7B35499CFBEB0FF5778127ABA4FB2C4B79A6B8D3D831D4379C4048C238796BD',
		},
		{
			gaugeId: '2014',
			denom: 'ibc/E7B35499CFBEB0FF5778127ABA4FB2C4B79A6B8D3D831D4379C4048C238796BD',
		},
	],
	'617': [
		{
			gaugeId: '2125',
			denom: 'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
		},
		{
			gaugeId: '2126',
			denom: 'ibc/7A08C6F11EF0F59EB841B9F788A87EC9F2361C7D9703157EC13D940DC53031FA',
		},
	],
	'618': [
		{
			gaugeId: '2004',
			denom: 'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
		},
		{
			gaugeId: '2005',
			denom: 'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
		},
		{
			gaugeId: '2006',
			denom: 'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
		},
	],
	'619': [
		{
			gaugeId: '2007',
			denom: 'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
		},
		{
			gaugeId: '2008',
			denom: 'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
		},
		{
			gaugeId: '2009',
			denom: 'ibc/EA4C0A9F72E2CEDF10D0E7A9A6A22954DB3444910DB5BE980DF59B05A46DAD1C',
		},
	],
	'621': [
		{
			gaugeId: '2020',
			denom: 'ibc/307E5C96C8F60D1CBEE269A9A86C0834E1DB06F2B3788AE4F716EDB97A48B97D',
		},
	],
	'625': [
		{
			gaugeId: '2511',
			denom: 'ibc/E97634A40119F1898989C2A23224ED83FDD0A57EA46B3A094E287288D1672B44',
		},
	],
	'629': [
		{
			gaugeId: '2067',
			denom: 'ibc/8318FD63C42203D16DDCAF49FE10E8590669B3219A3E87676AC9DA50722687FB',
		},
		{
			gaugeId: '2068',
			denom: 'ibc/8318FD63C42203D16DDCAF49FE10E8590669B3219A3E87676AC9DA50722687FB',
		},
		{
			gaugeId: '2069',
			denom: 'ibc/8318FD63C42203D16DDCAF49FE10E8590669B3219A3E87676AC9DA50722687FB',
		},
	],
	'637': [
		{
			gaugeId: '2258',
			denom: 'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
		},
		{
			gaugeId: '2259',
			denom: 'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
		},
		{
			gaugeId: '2260',
			denom: 'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
		},
	],
	'638': [
		{
			gaugeId: '2261',
			denom: 'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
		},
		{
			gaugeId: '2262',
			denom: 'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
		},
		{
			gaugeId: '2263',
			denom: 'ibc/346786EA82F41FE55FAD14BF69AD8BA9B36985406E43F3CB23E6C45A285A9593',
		},
	],
	'641': [
		{
			gaugeId: '2925',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
		{
			gaugeId: '2926',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
		{
			gaugeId: '2927',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
	],
	'642': [
		{
			gaugeId: '2269',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
		{
			gaugeId: '2270',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
		{
			gaugeId: '2271',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
	],
	'643': [
		{
			gaugeId: '2928',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
		{
			gaugeId: '2929',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
		{
			gaugeId: '2930',
			denom: 'ibc/67795E528DF67C5606FC20F824EA39A6EF55BA133F4DC79C90A8C47A0901E17C',
		},
	],
	'648': [
		{
			gaugeId: '2939',
			denom: 'ibc/8061A06D3BD4D52C4A28FFECF7150D370393AF0BA661C3776C54FF32836C3961',
		},
	],
	'651': [
		{
			gaugeId: '2547',
			denom: 'ibc/8FEFAE6AECF6E2A255585617F781F35A8D5709A545A804482A261C0C9548A9D3',
		},
		{
			gaugeId: '2548',
			denom: 'ibc/8FEFAE6AECF6E2A255585617F781F35A8D5709A545A804482A261C0C9548A9D3',
		},
		{
			gaugeId: '2549',
			denom: 'ibc/8FEFAE6AECF6E2A255585617F781F35A8D5709A545A804482A261C0C9548A9D3',
		},
	],
};

export const PoolsPerPage = 10;
export const RewardEpochIdentifier = 'day';

/**
 * Determine the channel info per the chain.
 * Guide users to use the same channel for convenience.
 */
export const IBCAssetInfos: {
	counterpartyChainId: string;
	// Souce channel id based on the Osmosis chain
	sourceChannelId: string;
	// Destination channel id from Osmosis chain
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
}[] = [];

const prefix = env('PREFIX');
const denom = env('COIN_DENOM');
const minDenom = env('COIN_MINIMAL_DENOM');
const decimals = parseInt(env('COIN_DECIMALS'), 10);

export const EmbedChainInfos: ChainInfoWithExplorer[] = [
	{
		rpc: env('RPC_URL'),
		rest: env('REST_URL'),
		chainId: env('CHAIN_ID'),
		chainName: env('CHAIN_NAME'),
		stakeCurrency: {
			coinDenom: denom,
			coinMinimalDenom: minDenom,
			coinDecimals: decimals,
			coinGeckoId: prefix,
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
			},
		],
		feeCurrencies: [
			{
				coinDenom: denom,
				coinMinimalDenom: minDenom,
				coinDecimals: decimals,
				coinGeckoId: prefix,
			},
		],
		gasPriceStep: {
			low: 0.01,
			average: parseFloat(env('GAS_PRICE_STEP_AVERAGE')),
			high: 0.03,
		},
		explorerUrlToTx: `${env('EXPLORER_URL')}/txs/{txHash}`,
	},
];
