import { bindActionCreators } from 'redux';
import { useMemo } from 'react';
import { useAppDispatch } from './useAppDispatch';

export function useActions<T>(actions: T, deps: Array<any> = []) {
	const dispatch = useAppDispatch();

	return useMemo<T>(() => {
		if (Array.isArray(actions)) {
			return actions.map(a => bindActionCreators(a, dispatch));
		}

		return bindActionCreators(actions as any, dispatch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...(actions as any), dispatch, ...deps]);
}
