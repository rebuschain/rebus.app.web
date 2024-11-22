import React, { FunctionComponent } from 'react';
import { Button } from 'src/components/common/button';
import styled from 'styled-components';
import { useConnectWallet } from 'src/dialogs';
import { WALLET_LIST } from 'src/constants/wallet';

export const KEPLR_WALLET_CONFIG = WALLET_LIST.find(wallet => wallet.walletType === 'keplr')!;

const KeplrStep: FunctionComponent<React.PropsWithChildren<{ onSkip: () => void }>> = ({ onSkip }) => {
	const connectWallet = useConnectWallet();

	return (
		<BackgroundStyled>
			<div
				className="p-4.5 md:pt-4.5 font-body flex flex-col items-center mx-auto"
				style={{ maxWidth: '100%', width: '500px' }}>
				<h1 className="text-lg font-semibold mb-4">Optional: Connect Your Keplr Wallet</h1>

				<p className="mb-4">
					To switch from the Layer1 network to the Layer2 network, you can also connect your Keplr wallet. Click the
					button below to get started.
				</p>

				<Button
					backgroundStyle="secondary"
					onClick={e => {
						e.preventDefault();
						onSkip();
					}}
					style={{
						marginBottom: '8px',
						width: '140px',
					}}>
					Skip
				</Button>
				<Button
					backgroundStyle="primary"
					onClick={e => {
						e.preventDefault();
						connectWallet(KEPLR_WALLET_CONFIG, false);
					}}
					style={{
						width: '260px',
					}}>
					Connect Keplr Wallet
				</Button>
			</div>
		</BackgroundStyled>
	);
};

const BackgroundStyled = styled.div`
	background-color: ${props => props.theme.gray.lightest};
	border-radius: 20px;
	color: ${props => props.theme.text};
	max-width: 80%;
`;

export { KeplrStep };
