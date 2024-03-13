import cn from 'clsx';
import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { AppCurrency } from '@keplr-wallet/types';
import { AmountInput } from '../components/form/inputs';
import { colorWhiteEmphasis } from '../emotion-styles/colors';
import { useStore } from '../stores';
import { Bech32Address } from '@keplr-wallet/cosmos';
import { useFakeFeeConfig } from '../hooks/tx';
import { useBasicAmountConfig } from '../hooks/tx/basic-amount-config';
import { wrapBaseDialog } from './base';
import { useAccountConnection } from '../hooks/account/use-account-connection';
import { useCustomBech32Address } from '../hooks/account/use-custom-bech32-address';
import { ConnectAccountButton } from '../components/connect-account-button';
import { Button } from '../components/common/button';
import { displayToast, TToastType } from '../components/common/toasts';
import { gas } from '../constants/default-gas-values';
import { config } from '../config-insync';
import { WalletStore } from '../stores/wallet';
import { createRootStore } from '../stores/root';
import { AminoMsgConvertCoin, MessageMsgConvertCoin } from '../stores/wallet/messages/convert-coin';
import { AminoMsgConvertERC20, MessageMsgConvertERC20 } from '../stores/wallet/messages/convert-erc20';
import { aminoSignTx } from '../utils/helper';
import { TransactionResponse } from '../stores/wallet/types';
import { getAminoTx, getEthTx } from '../utils/tx';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';

export const ConvertDialog = wrapBaseDialog(
	observer(
		({
			currency,
			tokenAddress,
			close,
			isMobileView,
		}: {
			currency: AppCurrency;
			tokenAddress: string;
			close: () => void;
			isMobileView: boolean;
		}) => {
			const { chainStore, accountStore, queriesStore, walletStore } = useStore();
			const [{ accountStore: counterpartyAccountStore }] = useState(() => createRootStore(false));
			const [counterpartyWalletStore] = useState(() => new WalletStore());

			const queries = queriesStore.get(chainStore.current.chainId);
			const chain = chainStore.getChain(chainStore.current.chainId);
			const account = accountStore.getAccount(chainStore.current.chainId);
			const { isEvmos } = account.rebus;
			const counterpartyAccount = counterpartyAccountStore.getAccount(chainStore.current.chainId);

			const fromAddress = pickOne(account.bech32Address, walletStore.address, !walletStore.isLoaded);
			const toAddress = pickOne(
				counterpartyWalletStore.address,
				counterpartyAccount.bech32Address,
				!walletStore.isLoaded
			);

			// custom withdraw address state
			const [customWithdrawAddr, isValidCustomWithdrawAddr, setCustomWithdrawAddr] = useCustomBech32Address();
			const [isEditingWithdrawAddr, setIsEditingWithdrawAddr] = useState(false);
			const [didVerifyWithdrawRisks, setDidVerifyWithdrawRisks] = useState(false);
			const [didConfirmWithdrawAddr, setDidConfirmWithdrawAddr] = useState(false);

			const [isSubmitting, setIsSubmitting] = useState(false);

			const bal = walletStore.isLoaded
				? walletStore.erc20BalanceMap.get(tokenAddress)
				: queries.queryBalances.getQueryBech32Address(fromAddress).getBalanceFromCurrency(currency);

			useEffect(() => {
				counterpartyAccount.init();
			}, [counterpartyAccount]);

			useEffect(() => {
				if (!walletStore.isLoaded) {
					counterpartyWalletStore.init('metamask', false, true);
				}
			}, [counterpartyWalletStore, walletStore.isLoaded]);

			useEffect(() => {
				if (walletStore.isLoaded && walletStore.isValidNetwork(walletStore.network, true)) {
					walletStore.getBalance(tokenAddress, currency);
				}
			}, [currency, tokenAddress, walletStore]);

			const metamaskQueryBalances = useMemo(
				() => ({
					getQueryBech32Address: (sender: string) => ({
						getBalanceFromCurrency: (currency: AppCurrency) => {
							if (walletStore.isLoaded && walletStore.rebusAddress === sender) {
								return walletStore.getBalance(tokenAddress, currency);
							}

							return walletStore.getBalance(tokenAddress, currency);
						},
					}),
				}),
				[tokenAddress, walletStore]
			);

			const amountConfig = useBasicAmountConfig(
				chainStore,
				chainStore.current.chainId,
				pickOne(account.bech32Address, walletStore.rebusAddress, !walletStore.isLoaded),
				currency,
				pickOne(queries.queryBalances, metamaskQueryBalances as any, !walletStore.isLoaded)
			);
			const feeConfig = useFakeFeeConfig(chainStore, chainStore.current.chainId, account.msgOpts.ibcTransfer.gas);
			amountConfig.setFeeConfig(feeConfig);

			const { isAccountConnected: isAccountConnectedRoot, connectAccount } = useAccountConnection();
			const isAccountConnected =
				isAccountConnectedRoot && (!walletStore.isLoaded || walletStore.walletType === 'metamask');

			const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
				e.preventDefault();

				setIsSubmitting(true);

				const receiver = didConfirmWithdrawAddr ? customWithdrawAddr : toAddress;
				const method = walletStore.isLoaded ? 'convertERC20' : 'convertCoin';
				const gasAmount = walletStore.isLoaded ? gas.convert_erc20 : gas.convert_coin;
				let txCode = 0;
				let txHash: string | undefined = '';

				const aminoTx = getAminoTx<AminoMsgConvertCoin | AminoMsgConvertERC20>(
					gasAmount,
					walletStore.isLoaded
						? ({
								typeUrl: '/rebus.erc20.v1.MsgConvertERC20',
								value: {
									amount: amountConfig.actualAmount,
									contractAddress: tokenAddress,
									sender: fromAddress,
									receiver,
								},
						  } as AminoMsgConvertERC20)
						: ({
								typeUrl: '/rebus.erc20.v1.MsgConvertCoin',
								value: {
									coin: {
										amount: amountConfig.actualAmount,
										denom: amountConfig.currency.coinMinimalDenom,
									},
									sender: fromAddress,
									receiver,
								},
						  } as AminoMsgConvertCoin)
				);
				const ethTx = getEthTx<MessageMsgConvertCoin | MessageMsgConvertERC20>(
					gasAmount,
					walletStore.isLoaded
						? ({
								amount: amountConfig.actualAmount,
								contractAddress: tokenAddress,
								sender: fromAddress,
								receiver: receiver,
						  } as MessageMsgConvertERC20)
						: ({
								amount: amountConfig.actualAmount,
								denom: amountConfig.currency.coinMinimalDenom,
								sender: fromAddress,
								receiver: receiver,
						  } as MessageMsgConvertCoin)
				);
				let txLog = '';

				try {
					if (walletStore.isLoaded) {
						const tx: TransactionResponse = await walletStore[method](ethTx as any, aminoTx as any);
						txCode = tx?.tx_response?.code || 0;
						txHash = tx?.tx_response?.txhash;
						txLog = tx?.tx_response?.raw_log || '';
					} else {
						const signer = isEvmos
							? ((window.getOfflineSigner &&
									window.getOfflineSigner(chainStore.current.chainId)) as OfflineDirectSigner)
							: null;
						const tx = await aminoSignTx(aminoTx, account.bech32Address, signer, isEvmos);
						txCode = tx?.code;
						txHash = tx?.transactionHash;
						txLog = tx?.rawLog || '';
					}

					if (txCode !== 0) {
						throw new Error(txLog);
					}

					if (walletStore.isLoaded) {
						walletStore.getBalance(tokenAddress, currency, true);
					} else {
						queries.queryBalances.getQueryBech32Address(fromAddress).fetch();
					}

					setIsSubmitting(false);
					displayToast(TToastType.TX_SUCCESSFUL, {
						customLink: txHash ? chain.raw.explorerUrlToTx.replace('{txHash}', txHash.toUpperCase()) : undefined,
						message: 'Balance will be updated momentarily',
					});

					close();
				} catch (error) {
					setIsSubmitting(false);

					const message = (error as any)?.message || '';

					if (message.indexOf('not yet found on the chain') > -1) {
						displayToast(TToastType.TX_BROADCASTING);
					} else {
						displayToast(TToastType.TX_FAILED, { message });
					}
				}
			};

			return (
				<div className="w-full h-full text-white-high">
					<div className="mb-5 md:mb-10 flex justify-between items-center w-full">
						<h5 className="text-lg md:text-xl">Convert Asset</h5>
					</div>
					<h6 className="mb-3 md:mb-4 text-base md:text-lg">
						{walletStore.isLoaded ? 'To Cosmos Asset' : 'To ERC-20 Asset'}
					</h6>
					<p className="text-white mb-3">
						To convert this asset to {walletStore.isLoaded ? 'an ERC-20 Token' : 'a Cosmos Asset'}, please disconnect
						the current wallet and connect to {walletStore.isLoaded ? 'Keplr' : 'Metamask'}
					</p>
					<section className={`flex flex-col items-center`}>
						<div className="w-full flex-1 p-3 md:p-4 border border-white-faint rounded-2xl">
							<p className="text-white-high">From</p>
							<p className="text-white-disabled truncate overflow-ellipsis">
								{Bech32Address.shortenAddress(fromAddress, 100)}
							</p>
						</div>
						<div className="flex justify-center items-center w-10 my-2 md:my-0">
							<img src="/public/assets/icons/arrow-down.svg" />
						</div>
						<div
							className={`w-full flex-1 p-3 md:p-4 border ${
								isValidCustomWithdrawAddr ? 'border-white-faint' : 'border-missionError'
							} rounded-2xl`}>
							<div className="flex place-content-between">
								<div className="flex gap-2">
									<p className="text-white-high">To</p>
								</div>
								{!isValidCustomWithdrawAddr && <p className="text-error">Invalid address</p>}
							</div>
							{isEditingWithdrawAddr ? (
								<>
									{isEditingWithdrawAddr && (
										<div className="flex gap-3 w-full border border-secondary-200 rounded-xl p-1 my-2">
											<img className="ml-2 h-3 my-auto" src="/public/assets/icons/warning.svg" />
											<p className="text-xs">
												Warning: Transfer to central exchange address could result in loss of funds.
											</p>
										</div>
									)}
									<div className="flex gap-2 place-content-between p-1 bg-background rounded-lg">
										<AmountInput
											style={{ fontSize: '14px', textAlign: 'left' }}
											value={customWithdrawAddr}
											onChange={(e: any) =>
												setCustomWithdrawAddr(e.target.value, config.PREFIX, true, !walletStore.isLoaded)
											}
										/>
										<button
											onClick={() => {
												setDidConfirmWithdrawAddr(true);
												setIsEditingWithdrawAddr(false);
											}}
											className={cn('my-auto p-1.5 flex justify-center items-center rounded-md md:static', {
												'bg-primary-200 hover:opacity-75 cursor-pointer ':
													didVerifyWithdrawRisks && isValidCustomWithdrawAddr,
												'opacity-30': !didVerifyWithdrawRisks || !isValidCustomWithdrawAddr,
											})}
											disabled={!didVerifyWithdrawRisks || !isValidCustomWithdrawAddr}>
											<p className="text-xs text-white-high leading-none">Enter</p>
										</button>
									</div>
									<label
										htmlFor="checkbox"
										className="text-xs flex justify-end items-center mr-2 mt-2 mb-1 cursor-pointer"
										onClick={() => setDidVerifyWithdrawRisks(!didVerifyWithdrawRisks)}>
										{didVerifyWithdrawRisks ? (
											<div className="mr-2.5">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
													<path
														fillRule="evenodd"
														clipRule="evenodd"
														d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4ZM20.6717 7.43656C21.1889 6.78946 21.0837 5.84556 20.4366 5.32831C19.7895 4.81106 18.8456 4.91633 18.3283 5.56344L10.2439 15.6773L5.61855 10.5006C5.06659 9.88282 4.11834 9.82948 3.50058 10.3814C2.88282 10.9334 2.82948 11.8817 3.38145 12.4994L9.18914 18.9994C9.48329 19.3286 9.90753 19.5115 10.3488 19.4994C10.7902 19.4873 11.2037 19.2814 11.4794 18.9366L20.6717 7.43656Z"
														fill="white"
													/>
												</svg>
											</div>
										) : (
											<div className="w-6 h-6 border-2 border-iconDefault mr-2.5 rounded" />
										)}
										I verify that I am sending to the correct address
									</label>
								</>
							) : (
								<p className="text-white-disabled truncate overflow-ellipsis">
									{Bech32Address.shortenAddress(didConfirmWithdrawAddr ? customWithdrawAddr : toAddress, 100)}
									{!isEditingWithdrawAddr && (
										<Button
											style={{
												borderRadius: '12px !important',
												fontSize: '11px',
												marginBottom: '3px',
												marginLeft: '6px',
												minWidth: '0',
												padding: '2px 8px',
											}}
											onClick={e => {
												e.preventDefault();
												setIsEditingWithdrawAddr(true);
												if (customWithdrawAddr === '') {
													setCustomWithdrawAddr(toAddress, config.PREFIX, true, !walletStore.isLoaded);
												}
												setDidConfirmWithdrawAddr(false);
												setDidVerifyWithdrawRisks(false);
											}}>
											Edit
										</Button>
									)}
								</p>
							)}
						</div>
					</section>
					<h6 className="text-base md:text-lg mt-7">Amount To Convert</h6>
					<div className="mt-3 md:mt-4 w-full p-0 md:p-5 border-0 md:border border-secondary-50 border-opacity-60 rounded-2xl">
						<p className="text-sm md:text-base mb-2">
							Available balance:{' '}
							<span className="text-primary-50">
								{bal
									?.upperCase(true)
									.trim(true)
									.maxDecimals(6)
									.toString()}
							</span>
						</p>
						<div
							className="py-2 px-2.5 bg-background rounded-lg flex gap-5 relative"
							style={{ gridTemplateColumns: 'calc(100% - 60px) 40px' }}>
							<AmountInput
								type="number"
								style={{ color: colorWhiteEmphasis }}
								onChange={e => {
									e.preventDefault();
									amountConfig.setAmount(e.currentTarget.value);
								}}
								value={amountConfig.amount}
							/>
							<button
								onClick={() => amountConfig.toggleIsMax()}
								className={cn(
									'my-auto p-1.5 bg-white-faint hover:opacity-75 cursor-pointer flex justify-center items-center rounded-md absolute top-2 right-2 md:static',
									amountConfig.isMax && 'bg-primary-200'
								)}>
								<p className="text-xs text-white-high leading-none">MAX</p>
							</button>
						</div>
					</div>
					<div className="w-full mt-6 md:mt-9 flex items-center justify-center">
						{!isAccountConnected ? (
							isAccountConnectedRoot ? (
								<p>Converting is only supported on Metamask and Keplr wallets</p>
							) : (
								<ConnectAccountButton
									className="w-full md:w-2/3 p-4 rounded-2xl"
									style={{ marginTop: isMobileView ? '16px' : '32px' }}
									onClick={e => {
										e.preventDefault();
										connectAccount();
									}}
								/>
							)
						) : (
							<Button
								disabled={isSubmitting || amountConfig.getError() != null || !isValidCustomWithdrawAddr}
								onClick={onSubmit}>
								{isSubmitting ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										className="animate-spin md:-ml-1 md:mr-3 h-5 w-5 text-white"
										viewBox="0 0 24 24">
										<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
										<path
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											className="opacity-75"
										/>
									</svg>
								) : (
									<h6 className="text-base md:text-lg">Convert</h6>
								)}
							</Button>
						)}
					</div>
				</div>
			);
		}
	)
);

function pickOne<V1, V2>(v1: V1, v2: V2, first: boolean): V1 | V2 {
	return first ? v1 : v2;
}
