import React, { FunctionComponent } from 'react';
import { Button } from 'src/components/common/button';
import styled from 'styled-components';
import { useConnectWallet } from 'src/dialogs';
import { WALLET_LIST } from 'src/constants/wallet';

export const METAMASK_WALLET_CONFIG = WALLET_LIST.find(wallet => wallet.walletType === 'metamask')!;

const MetamaskStep: FunctionComponent<React.PropsWithChildren<unknown>> = () => {
	const connectWallet = useConnectWallet();

	return (
		<BackgroundStyled>
			<div
				className="p-4.5 md:pt-4.5 font-body flex flex-col items-center mx-auto"
				style={{ maxWidth: '100%', width: '500px' }}>
				<h1 className="text-lg font-semibold mb-4">Connect Your MetaMask Wallet to Begin</h1>

				<p className="mb-4">
					To switch from the Layer1 network to the Layer2 network, you need to connect your MetaMask wallet. Click the
					button below to get started.
				</p>

				<Button
					backgroundStyle="primary"
					onClick={e => {
						e.preventDefault();
						connectWallet(METAMASK_WALLET_CONFIG);
					}}
					style={{
						width: '260px',
					}}>
					Connect Metamask Wallet
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

export { MetamaskStep };
