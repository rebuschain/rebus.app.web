import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { copyTextToClipboard } from 'src/utils/copy-to-clipboard';
import { ethToRebus, rebusToEth } from 'src/utils/rebus-converter';
import classNames from 'classnames';
import { snackbarActions } from 'src/reducers/slices';
import ConfirmDialog from 'src/dialogs/confirm-dialog';
import { useActions } from 'src/hooks/use-actions';
import TextField from 'src/components/insync/text-field/text-field';
import styled from 'styled-components';

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
		<ConverterStyled>
			<div
				className="p-4.5 md:pt-4.5 font-body flex flex-col items-center mx-auto"
				style={{ maxWidth: '100%', width: '500px' }}>
				<h1 className="text-lg font-semibold mb-4">Address Converter</h1>

				<div className="flex flex-col w-full">
					<TextField
						label="Input Address"
						value={address}
						placeholder="0x... / rebus1..."
						onChange={e => setAddress(e.currentTarget.value)}
					/>

					<TextField
						label="Converted"
						value={error || convertedAddress || 'Result...'}
						onChange={() => null}
						assistiveText={!convertedAddress && !error ? 'No result available' : ''}
						buttonText="Copy"
						onButtonClick={() => {
							copyTextToClipboard(convertedAddress, () => showMessage('Copied to clipboard!'));
						}}
					/>
				</div>
				<ConfirmDialog
					content={`Transfer only REBUS using this conversion tool. All other assets will be lost. To transfer other assets, please use the asset page.`}
					isOpen={isConfirmDialogOpen}
					onClose={onNotConfirmed}
					onConfirm={onConfirm}
					title="REBUS Conversion Tool"
				/>
			</div>
		</ConverterStyled>
	);
};

const ConverterStyled = styled.div`
	background-color: ${props => props.theme.gray.lightest};
	border-radius: 20px;
	color: ${props => props.theme.text};
	width: 50%;
`;

export { AddressConverter };
