import { useSelector, shallowEqual, DefaultRootState } from 'react-redux';
// eslint-disable-next-line prettier/prettier
import type { RootState } from 'src';

export function useShallowEqualSelector(selector: (state: RootState) => any) {
	return useSelector(selector, shallowEqual);
}
