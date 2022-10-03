import { useQuery } from 'react-query';
import { getPoolFinancialData } from '../../remotes/pools/get-pool-financial-data';

export function usePoolFinancialData() {
	return useQuery(['poolFinancialData'], getPoolFinancialData);
}
