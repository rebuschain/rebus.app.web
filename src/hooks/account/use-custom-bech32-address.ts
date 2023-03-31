import { useState, useCallback } from 'react';
import { Bech32Address } from '@keplr-wallet/cosmos';
import env from '@beam-australia/react-env';
import { isAddress } from 'ethers/lib/utils';

const rebusPrefix = env('PREFIX');

/**
 * Store state for using a custom & validated Bech32 address.
 * @returns [customBech32Address, isValid, setCustomBech32Address]
 */
export function useCustomBech32Address(): [
	string,
	boolean,
	(newCustomBech32Address: string, prefix: string, isWithdraw?: boolean, isEthAddress?: boolean) => void
] {
	const [customBech32Address, setCustomBech32Address] = useState<string>('');
	const [isValid, setIsValid] = useState(true);

	return [
		customBech32Address,
		isValid,
		useCallback(
			(newCustomBech32Address: string, prefix: string, isWithdraw = false, isEthAddress = false) => {
				let didThrow = false;

				if (isEthAddress) {
					didThrow = !isAddress(newCustomBech32Address);
					if (didThrow) {
						setIsValid(false);
					}
				} else {
					try {
						Bech32Address.validate(newCustomBech32Address, prefix);
					} catch (e) {
						if (isWithdraw) {
							try {
								Bech32Address.validate(newCustomBech32Address, rebusPrefix);
							} catch (ee) {
								setIsValid(false);
								didThrow = true;
							}
						} else {
							setIsValid(false);
							didThrow = true;
						}
					}
				}

				if (!didThrow) {
					setIsValid(true);
				}

				setCustomBech32Address(newCustomBech32Address);
			},
			[setIsValid, setCustomBech32Address]
		),
	];
}
