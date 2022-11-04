import { useRef, useEffect, LegacyRef } from 'react';

export function useClickOutside(callback: (e: MouseEvent) => void) {
	const callbackRef = useRef<(e: MouseEvent) => void>();
	const innerRef = useRef();

	useEffect(() => {
		callbackRef.current = callback;
	});

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (innerRef.current && callbackRef.current && !(innerRef.current as any).contains(e.target)) {
				callbackRef.current(e);
			}
		}

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, []);

	return innerRef as LegacyRef<any>;
}
