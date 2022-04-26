import { bindActionCreators, ActionCreator } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export function useActions<T>(actions: T, deps: Array<any> = []) {
	const dispatch = useDispatch();

	return useMemo(() => {
		if (Array.isArray(actions)) {
			return actions.map(a => bindActionCreators(a, dispatch));
		}

		return bindActionCreators(actions as any, dispatch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...(actions as any), dispatch, ...deps]);
}
