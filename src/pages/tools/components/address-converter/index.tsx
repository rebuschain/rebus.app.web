import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { copyTextToClipboard } from 'src/utils/copy-to-clipboard';
import { ethToRebus, rebusToEth } from 'src/utils/rebus-converter';
import classNames from 'classnames';
import { snackbarActions } from 'src/reducers/slices';
import ConfirmDialog from 'src/pages/stake/delegate-dialog/confirm-dialog';
import { useActions } from 'src/hooks/use-actions';
import { InsyncWrapper } from 'src/components/insync/insync-wrapper';

const AddressConverter: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const navigate = useNavigate();
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(true);
	const closeConfirmDialog = useCallback(() => setIsConfirmDialogOpen(false), []);
	const [address, setAddress] = useState('');
	const [convertedAddress, setConvertedAddress] = useState('');
	const [error, setError] = useState('');

	const [showMessage] = useActions([snackbarActions.showSnackbar]);

	const onConfirm = useCallback(() => {
		closeConfirmDialog();
	}, [closeConfirmDialog]);

	const onNotConfirmed = useCallback(() => {
		navigate('/');
	}, [navigate]);

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
		<InsyncWrapper>
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
				<ConfirmDialog
					content={`Transfer only REBUS using this conversion tool. All other assets will be lost. To transfer other assets, please use the asset page.`}
					isOpen={isConfirmDialogOpen}
					onClose={onNotConfirmed}
					onConfirm={onConfirm}
					title="REBUS Conversion Tool"
				/>
			</div>
		</InsyncWrapper>
	);
};

export { AddressConverter };
