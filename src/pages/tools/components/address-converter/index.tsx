import React, { FunctionComponent, useEffect, useState } from 'react';
import { copyTextToClipboard } from 'src/utils/copy-to-clipboard';
import { ethToRebus, rebusToEth } from 'src/utils/rebus-converter';
import classNames from 'classnames';
import { snackbarActions } from 'src/reducers/slices';
import { useActions } from 'src/hooks/use-actions';

const AddressConverter: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const [address, setAddress] = useState('');
	const [convertedAddress, setConvertedAddress] = useState('');
	const [error, setError] = useState('');

	const [showMessage] = useActions([snackbarActions.showSnackbar]);

	useEffect(() => {
		if (address) {
			try {
				setConvertedAddress(rebusToEth(address));
				setError('');
			} catch (ethError) {
				try {
					setConvertedAddress(ethToRebus(address));
					setError('');
				} catch (evmosError) {
					console.error('Error parsing address', ethError, evmosError);
					setError('Invalid Address');
				}
			}
		} else {
			setConvertedAddress('');
		}
	}, [address]);

	return (
		<div
			className="p-4.5 md:pt-4.5 bg-card rounded-2xl font-body flex flex-col items-center mx-auto"
			style={{ maxWidth: '100%', width: '500px' }}>
			<h1 className="text-lg font-semibold">Address Converter</h1>

			<div className="flex flex-col w-full">
				<div className="mt-4" style={{ height: '32px' }}>
					Input Address
				</div>
				<input
					className="text-white-high rounded-lg bg-background text-left font-title p-2"
					onChange={e => setAddress(e.currentTarget.value)}
					placeholder="0x... / rebus1..."
					value={address}
				/>

				<div className="mt-3" style={{ height: '32px' }}>
					Converted
				</div>
				<div className="relative rounded-lg bg-background">
					<div
						className={classNames(
							'p-2',
							'pr-10',
							error && 'text-missionError',
							!convertedAddress && !error && 'opacity-60'
						)}
						style={{ boxSizing: 'content-box' }}>
						{error || convertedAddress || 'Result...'}
					</div>
					<button
						className="flex-1 items-center justify-center absolute top-1.5 right-2 py-1.5 px-1"
						onClick={() => {
							copyTextToClipboard(convertedAddress, () => showMessage('Copied to clipboard!'));
						}}>
						<img className="text-white-high" src="/public/assets/common/copy.svg" />
					</button>
				</div>
			</div>
		</div>
	);
};

export { AddressConverter };
