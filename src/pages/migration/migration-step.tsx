import React, { FunctionComponent, useEffect, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useStore } from 'src/stores';
import { Button } from 'src/components/common/button';
import { Loader } from 'src/components/common/loader';
import { signKeplrArbitrary } from 'src/utils/helper';
import { gas } from 'src/constants/default-gas-values';
import { config } from 'src/config-insync';

const MigrationStep: FunctionComponent<React.PropsWithChildren<unknown>> = observer(() => {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [metamaskError, setMetamaskError] = useState(false);
	const [keplrError, setKeplrError] = useState(false);

	const { chainStore, accountStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);

	const migrate = async () => {
		setIsLoading(true);
		setIsSubmitted(true);

		if (!walletStore.isLoaded) {
			setMetamaskError(true);
			setIsLoading(false);
			return;
		}

		try {
			const migrationOpen = await walletStore.migrationOpen();

			if (migrationOpen) {
				await walletStore.registerAndFetchBalances();
			}
		} catch (err) {
			console.error('An error occurred when migrating the metamask wallet', err);
			setMetamaskError(true);
			setIsLoading(false);
			return;
		}

		if (account.bech32Address) {
			try {
				const sigRes = await signKeplrArbitrary(account.bech32Address, walletStore.address);
				const pubKey = sigRes?.pub_key?.value as string;
				const signature = sigRes?.signature as string;

				await walletStore.updateCosmosData(pubKey, walletStore.address, signature);
			} catch (err) {
				console.error('An error occurred when migrating the keplr wallet', err);
				setKeplrError(true);
				setIsLoading(false);
				return;
			}
		}

		setIsLoading(false);
		setIsSuccess(true);
	};

	return (
		<ConverterStyled hasBackground={isSubmitted && !isLoading}>
			<div className="p-4.5 md:pt-4.5 font-body flex flex-col items-center mx-auto" style={{ maxWidth: '100%' }}>
				<Button
					backgroundStyle="primary"
					disabled={isLoading || isSuccess}
					onClick={e => {
						e.preventDefault();
						migrate();
					}}
					style={{
						marginBottom: '8px',
						width: '160px',
					}}>
					<div className="flex items-center">
						Migrate
						{isLoading && <Loader style={{ height: '24px', width: '24px', marginLeft: '12px' }} />}
					</div>
				</Button>

				{isSubmitted && (
					<div>
						{!isLoading && metamaskError && (
							<p className={classNames(keplrError && 'mb-4')}>
								An error occurred when starting migration for the Metamask Wallet.
							</p>
						)}

						{!isLoading && keplrError && <p>An error occurred when starting migration for the Keplr Wallet.</p>}

						{isSuccess && (
							<p>
								Thank you for initiating the migration. Your assets are now being transferred from the Layer1 network to
								the Layer2 network. This process may take up to 30 days to complete.
							</p>
						)}
					</div>
				)}
			</div>
		</ConverterStyled>
	);
});

const ConverterStyled = styled.div<{ hasBackground: boolean }>`
	background-color: ${props => props.hasBackground && props.theme.gray.lightest};
	border-radius: 20px;
	color: ${props => props.theme.text};
	max-width: 80%;
	margin-top: 32px;
`;

export { MigrationStep };
