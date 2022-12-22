import { useEffect, useRef, useState } from 'react';

function useCallbackState<T>(initialValue: T): [T, (newValue: T, callback?: (state: T) => void) => void] {
	const [state, _setState] = useState<T>(initialValue);
	const callbackQueue = useRef<((state: T) => void)[]>([]);

	useEffect(() => {
		callbackQueue.current.forEach((cb: (state: T) => void) => cb(state));
		callbackQueue.current = [];
	}, [state]);

	const setState = (newValue: T, callback: ((state: T) => void) | undefined = undefined) => {
		_setState(newValue);

		if (callback && typeof callback === 'function') {
			callbackQueue.current.push(callback);
		}
	};

	return [state, setState];
}

export { useCallbackState };
