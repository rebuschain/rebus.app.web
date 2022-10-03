import { useSelector, shallowEqual } from 'react-redux';
// eslint-disable-next-line prettier/prettier
import type { RootState } from 'src/reducers/store';

export function useShallowEqualSelector(selector: (state: RootState) => any) {
	return useSelector(selector, shallowEqual);
}
