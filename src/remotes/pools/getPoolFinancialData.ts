import axios from 'axios';
import env from '@beam-australia/react-env';

interface PoolFinancialDataRes {
	/** coinDenom */
	symbol: string;
	/** coin amount added to pool */
	amount: number;
	/** coinMinimalDenom */
	denom: string;
	/** empty string if not listed in coingecko */
	coingecko_id: string;
	/** pool liquidity in usd */
	liquidity: number;
	volume_24h: number;
	volume_7d: number;
	/** coin price in usd*/
	price: number;
}

export async function getPoolFinancialData() {
	const res = await axios.get<{ [poolId: string]: [PoolFinancialDataRes, PoolFinancialDataRes] }>(
		`${env('IMPERATOR_URL')}/pools/v2/all?low_liquidity=true`
	);
	return res.data;
}
