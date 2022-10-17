import cn from 'clsx';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { IBCCurrency } from '@keplr-wallet/types';
import { AmountInput } from '../components/form/inputs';
import { colorWhiteEmphasis } from '../emotion-styles/colors';
import { useStore } from '../stores';
import { Bech32Address, ChainIdHelper } from '@keplr-wallet/cosmos';
import { getKeplrFromWindow, WalletStatus } from '@keplr-wallet/stores';
import { useFakeFeeConfig } from '../hooks/tx';
import { useBasicAmountConfig } from '../hooks/tx/basic-amount-config';
import { wrapBaseDialog } from './base';
import { useAccountConnection } from '../hooks/account/use-account-connection';
import { useCustomBech32Address } from '../hooks/account/use-custom-bech32-address';
import { ConnectAccountButton } from '../components/connect-account-button';
import { Buffer } from 'buffer/';
import { Button } from 'src/components/common/button';
import { Dec, DecUtils, Int } from '@keplr-wallet/unit';
import { displayToast, TToastType } from 'src/components/common/toasts';
import { gas } from 'src/constants/default-gas-values';
import { config } from 'src/config-insync';

export const TransferDialog = wrapBaseDialog(
	observer(
		({
			currency,
			counterpartyChainId,
			sourceChannelId,
			destChannelId,
			isWithdraw,
			close,
			isMobileView,

			ics20ContractAddress,
		}: {
			currency: IBCCurrency;
			counterpartyChainId: string;
			sourceChannelId: string;
			destChannelId: string;
			isWithdraw: boolean;
			close: () => void;
			isMobileView: boolean;

			ics20ContractAddress?: string;
		}) => {
			const { chainStore, accountStore, queriesStore, ibcTransferHistoryStore, walletStore } = useStore();

			const account = accountStore.getAccount(chainStore.current.chainId);
			const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
			const counterpartyAccount = accountStore.getAccount(counterpartyChainId);
			const counterpartyChainStore = chainStore.getChain(counterpartyChainId);
			const counterpartyBech32Prefix = counterpartyChainStore.bech32Config.bech32PrefixAccAddr;

			// custom withdraw address state
			const [customWithdrawAddr, isValidCustomWithdrawAddr, setCustomWithdrawAddr] = useCustomBech32Address();
			const [isEditingWithdrawAddr, setIsEditingWithdrawAddr] = useState(false);
			const [didVerifyWithdrawRisks, setDidVerifyWithdrawRisks] = useState(false);
			const [didConfirmWithdrawAddr, setDidConfirmWithdrawAddr] = useState(false);

			const bal = queriesStore
				.get(chainStore.current.chainId)
				.queryBalances.getQueryBech32Address(address)
				.getBalanceFromCurrency(currency);
			const counterpartyBal = queriesStore
				.get(counterpartyChainId)
				.queryBalances.getQueryBech32Address(counterpartyAccount.bech32Address)
				.getBalanceFromCurrency(currency.originCurrency!);

			// detect if a user rejects connection to a chain account in Keplr
			const [counterpartyInitAttempted, setCounterpartyInitAttempted] = useState(false);

			useEffect(() => {
				if (counterpartyInitAttempted && counterpartyAccount.walletStatus === WalletStatus.NotInit && isWithdraw) {
					counterpartyAccount.disconnect();
					setIsEditingWithdrawAddr(true);
					setCustomWithdrawAddr(counterpartyAccount.bech32Address, counterpartyBech32Prefix, isWithdraw);
				} else if (address && counterpartyAccount.walletStatus === WalletStatus.NotInit && !counterpartyInitAttempted) {
					counterpartyAccount.init();
					setCounterpartyInitAttempted(true);
				}
			}, [
				address,
				counterpartyAccount.walletStatus,
				counterpartyAccount,
				counterpartyBech32Prefix,
				counterpartyInitAttempted,
				setIsEditingWithdrawAddr,
				setCustomWithdrawAddr,
				setCounterpartyInitAttempted,
				isWithdraw,
			]);

			const amountConfig = useBasicAmountConfig(
				chainStore,
				chainStore.current.chainId,
				pickOne(address, counterpartyAccount.bech32Address, isWithdraw),
				pickOne(currency, currency.originCurrency!, isWithdraw),
				pickOne(
					queriesStore.get(chainStore.current.chainId).queryBalances,
					queriesStore.get(counterpartyChainId).queryBalances,
					isWithdraw
				)
			);
			const feeConfig = useFakeFeeConfig(
				chainStore,
				pickOne(chainStore.current.chainId, counterpartyChainId, isWithdraw),
				pickOne(account.msgOpts.ibcTransfer.gas, counterpartyAccount.msgOpts.ibcTransfer.gas, isWithdraw)
			);
			amountConfig.setFeeConfig(feeConfig);

			const { isAccountConnected, connectAccount } = useAccountConnection();

			useEffect(() => {
				if (isAccountConnected && currency.originCurrency) {
					if ('contractAddress' in currency.originCurrency) {
						getKeplrFromWindow()
							.then(keplr => {
								// If the keplr is from extension and the ibc token is from cw20,
								// suggest the token to the keplr.
								if (keplr && keplr.mode === 'extension') {
									if (currency.originChainId && currency.originCurrency && 'contractAddress' in currency.originCurrency)
										keplr.suggestToken(currency.originChainId, currency.originCurrency.contractAddress).catch(e => {
											console.log(e);
										});
								}
							})
							.catch(e => {
								console.log(e);
							});
					}
				}
			}, [isAccountConnected, currency.originCurrency, currency.originChainId]);

			return (
				<div className="w-full h-full text-white-high">
					<div className="mb-5 md:mb-10 flex justify-between items-center w-full">
						<h5 className="text-lg md:text-xl">{isWithdraw ? 'Withdraw' : 'Deposit'} IBC Asset</h5>
					</div>
					<h6 className="mb-3 md:mb-4 text-base md:text-lg">IBC Transfer</h6>
					<section className={`flex flex-col items-center`}>
						<div className="w-full flex-1 p-3 md:p-4 border border-white-faint rounded-2xl">
							<p className="text-white-high">From</p>
							<p className="text-white-disabled truncate overflow-ellipsis">
								{pickOne(
									Bech32Address.shortenAddress(address, 100),
									Bech32Address.shortenAddress(counterpartyAccount.bech32Address, 100),
									isWithdraw
								)}
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
												Warning: {isWithdraw ? 'Withdrawal' : 'Deposit'} to central exchange address could result in
												loss of funds.
											</p>
										</div>
									)}
									<div className="flex gap-2 place-content-between p-1 bg-background rounded-lg">
										<AmountInput
											style={{ fontSize: '14px', textAlign: 'left' }}
											value={customWithdrawAddr}
											onChange={(e: any) =>
												setCustomWithdrawAddr(
													e.target.value,
													isWithdraw ? counterpartyBech32Prefix : config.PREFIX,
													isWithdraw
												)
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
									{pickOne(
										Bech32Address.shortenAddress(
											didConfirmWithdrawAddr ? customWithdrawAddr : counterpartyAccount.bech32Address,
											100
										),
										Bech32Address.shortenAddress(didConfirmWithdrawAddr ? customWithdrawAddr : address, 100),
										isWithdraw
									)}
									{!isEditingWithdrawAddr && counterpartyAccount.walletStatus === WalletStatus.Loaded && (
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
													if (isWithdraw) {
														setCustomWithdrawAddr(
															counterpartyAccount.bech32Address,
															counterpartyBech32Prefix,
															isWithdraw
														);
													} else {
														setCustomWithdrawAddr(address, config.PREFIX, isWithdraw);
													}
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
					<h6 className="text-base md:text-lg mt-7">Amount To {isWithdraw ? 'Withdraw' : 'Deposit'}</h6>
					<div className="mt-3 md:mt-4 w-full p-0 md:p-5 border-0 md:border border-secondary-50 border-opacity-60 rounded-2xl">
						<p className="text-sm md:text-base mb-2">
							Available balance:{' '}
							<span className="text-primary-50">
								{pickOne(
									bal
										.upperCase(true)
										.trim(true)
										.maxDecimals(6)
										.toString(),
									counterpartyBal
										.upperCase(true)
										.trim(true)
										.maxDecimals(6)
										.toString(),
									isWithdraw
								)}
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
							<ConnectAccountButton
								className="w-full md:w-2/3 p-4 md:p-6 rounded-2xl"
								style={{ marginTop: isMobileView ? '16px' : '32px' }}
								onClick={e => {
									e.preventDefault();
									connectAccount();
								}}
							/>
						) : (
							<Button
								className="w-full md:w-2/3 p-4 md:p-6 h-14"
								disabled={
									(isWithdraw && !walletStore.isLoaded && !account.isReadyToSendMsgs) ||
									(!isWithdraw && !counterpartyAccount.isReadyToSendMsgs) ||
									amountConfig.getError() != null ||
									!isValidCustomWithdrawAddr
								}
								onClick={async e => {
									e.preventDefault();

									try {
										if (isWithdraw) {
											const sender = address;
											const recipient = didConfirmWithdrawAddr ? customWithdrawAddr : counterpartyAccount.bech32Address;
											const isRecipientValid =
												counterpartyAccount.bech32Address || (customWithdrawAddr && isValidCustomWithdrawAddr);

											if (walletStore.isLoaded && isRecipientValid) {
												const gasPriceStepAverage = isWithdraw
													? config.GAS_PRICE_STEP_AVERAGE
													: counterpartyChainStore.gasPriceStep?.average || 0;

												let dec = new Dec(amountConfig.amount);
												dec = dec.mul(
													DecUtils.getTenExponentNInPrecisionRange(
														isWithdraw ? config.COIN_DECIMALS : currency.coinDecimals
													)
												);
												const actualAmount = dec.truncate().toString();

												const res = await walletStore.sendIBCTransfer(
													{
														fee: {
															amount: String(BigInt(gas.ibc_transfer * gasPriceStepAverage)),
															denom: isWithdraw ? config.COIN_MINIMAL_DENOM : amountConfig.currency.coinMinimalDenom,
															gas: gas.ibc_transfer.toString(),
														},
														msg: {
															sourcePort: 'transfer',
															sourceChannel: sourceChannelId,
															amount: actualAmount,
															denom: amountConfig.currency.coinMinimalDenom,
															receiver: recipient,
															revisionNumber: ChainIdHelper.parse(counterpartyChainId).version,
															revisionHeight: 0,
															timeoutTimestamp: '0',
														},
														memo: '',
													},
													async () => {
														const destinationBlockHeight = queriesStore
															.get(counterpartyChainId)
															.cosmos.queryBlock.getBlock('latest');
														await destinationBlockHeight.waitFreshResponse();
														if (destinationBlockHeight.height.equals(new Int('0'))) {
															throw new Error(`Failed to fetch the latest block of ${counterpartyChainId}`);
														}

														return destinationBlockHeight.height;
													}
												);

												if (res?.tx_response?.raw_log?.includes('insufficient funds')) {
													displayToast(TToastType.TX_FAILED, {
														message: `Insufficient ${isWithdraw ? config.COIN_DENOM : amountConfig.currency.coinDenom}`,
													});
												}

												const hash = res?.tx_response?.txhash;

												if (hash) {
													ibcTransferHistoryStore.pushUncommitedHistore({
														txHash: Buffer.from(hash).toString('hex'),
														sourceChainId: chainStore.current.chainId,
														destChainId: counterpartyChainId,
														amount: { amount: amountConfig.amount, currency: amountConfig.sendCurrency },
														recipient,
														sender,
													});

													// TODO: Implement tx tracer to detect when transaction finishes
												}
											} else if (account.isReadyToSendMsgs && isRecipientValid) {
												await account.cosmos.sendIBCTransferMsg(
													{
														portId: 'transfer',
														channelId: sourceChannelId,
														counterpartyChainId,
													},
													amountConfig.amount,
													amountConfig.currency,
													recipient,
													'',
													undefined,
													undefined,
													{
														onBroadcasted: (txHash: Uint8Array) =>
															ibcTransferHistoryStore.pushUncommitedHistore({
																txHash: Buffer.from(txHash).toString('hex'),
																sourceChainId: chainStore.current.chainId,
																destChainId: counterpartyChainId,
																amount: { amount: amountConfig.amount, currency: amountConfig.sendCurrency },
																recipient,
																sender,
															}),
														onFulfill: tx => {
															if (!tx.code) {
																const events = tx?.events as
																	| { type: string; attributes: { key: string; value: string }[] }[]
																	| undefined;
																if (events) {
																	for (const event of events) {
																		if (event.type === 'send_packet') {
																			const attributes = event.attributes;
																			const sourceChannelAttr = attributes.find(
																				attr => attr.key === Buffer.from('packet_src_channel').toString('base64')
																			);
																			const sourceChannel = sourceChannelAttr
																				? Buffer.from(sourceChannelAttr.value, 'base64').toString()
																				: undefined;
																			const destChannelAttr = attributes.find(
																				attr => attr.key === Buffer.from('packet_dst_channel').toString('base64')
																			);
																			const destChannel = destChannelAttr
																				? Buffer.from(destChannelAttr.value, 'base64').toString()
																				: undefined;
																			const sequenceAttr = attributes.find(
																				attr => attr.key === Buffer.from('packet_sequence').toString('base64')
																			);
																			const sequence = sequenceAttr
																				? Buffer.from(sequenceAttr.value, 'base64').toString()
																				: undefined;
																			const timeoutHeightAttr = attributes.find(
																				attr => attr.key === Buffer.from('packet_timeout_height').toString('base64')
																			);
																			const timeoutHeight = timeoutHeightAttr
																				? Buffer.from(timeoutHeightAttr.value, 'base64').toString()
																				: undefined;
																			const timeoutTimestampAttr = attributes.find(
																				attr => attr.key === Buffer.from('packet_timeout_timestamp').toString('base64')
																			);
																			const timeoutTimestamp = timeoutTimestampAttr
																				? Buffer.from(timeoutTimestampAttr.value, 'base64').toString()
																				: undefined;

																			if (sourceChannel && destChannel && sequence) {
																				ibcTransferHistoryStore.pushPendingHistory({
																					txHash: tx.hash,
																					sourceChainId: chainStore.current.chainId,
																					sourceChannelId: sourceChannel,
																					destChainId: counterpartyChainId,
																					destChannelId: destChannel,
																					sequence,
																					sender,
																					recipient,
																					amount: { amount: amountConfig.amount, currency: amountConfig.sendCurrency },
																					timeoutHeight,
																					timeoutTimestamp,
																				});
																			}
																		}
																	}
																}
															}

															close();
														},
													},
													account.rebus.isEvmos
												);
											}
										} else {
											const sender = counterpartyAccount.bech32Address;
											const recipient = didConfirmWithdrawAddr ? customWithdrawAddr : address;

											if (counterpartyAccount.isReadyToSendMsgs && recipient) {
												const txEvents = {
													onBroadcasted: (txHash: Uint8Array) =>
														ibcTransferHistoryStore.pushUncommitedHistore({
															txHash: Buffer.from(txHash).toString('hex'),
															sourceChainId: counterpartyChainId,
															destChainId: chainStore.current.chainId,
															amount: { amount: amountConfig.amount, currency: amountConfig.sendCurrency },
															sender,
															recipient,
														}),
													onFulfill: (tx: any) => {
														if (!tx.code) {
															const events = tx?.events as
																| { type: string; attributes: { key: string; value: string }[] }[]
																| undefined;
															if (events) {
																for (const event of events) {
																	if (event.type === 'send_packet') {
																		const attributes = event.attributes;
																		const sourceChannelAttr = attributes.find(
																			attr => attr.key === Buffer.from('packet_src_channel').toString('base64')
																		);
																		const sourceChannel = sourceChannelAttr
																			? Buffer.from(sourceChannelAttr.value, 'base64').toString()
																			: undefined;
																		const destChannelAttr = attributes.find(
																			attr => attr.key === Buffer.from('packet_dst_channel').toString('base64')
																		);
																		const destChannel = destChannelAttr
																			? Buffer.from(destChannelAttr.value, 'base64').toString()
																			: undefined;
																		const sequenceAttr = attributes.find(
																			attr => attr.key === Buffer.from('packet_sequence').toString('base64')
																		);
																		const sequence = sequenceAttr
																			? Buffer.from(sequenceAttr.value, 'base64').toString()
																			: undefined;
																		const timeoutHeightAttr = attributes.find(
																			attr => attr.key === Buffer.from('packet_timeout_height').toString('base64')
																		);
																		const timeoutHeight = timeoutHeightAttr
																			? Buffer.from(timeoutHeightAttr.value, 'base64').toString()
																			: undefined;
																		const timeoutTimestampAttr = attributes.find(
																			attr => attr.key === Buffer.from('packet_timeout_timestamp').toString('base64')
																		);
																		const timeoutTimestamp = timeoutTimestampAttr
																			? Buffer.from(timeoutTimestampAttr.value, 'base64').toString()
																			: undefined;

																		if (sourceChannel && destChannel && sequence) {
																			ibcTransferHistoryStore.pushPendingHistory({
																				txHash: tx.hash,
																				sourceChainId: counterpartyChainId,
																				sourceChannelId: sourceChannel,
																				destChainId: chainStore.current.chainId,
																				destChannelId: destChannel,
																				sequence,
																				sender,
																				recipient,
																				amount: { amount: amountConfig.amount, currency: amountConfig.sendCurrency },
																				timeoutHeight,
																				timeoutTimestamp,
																			});
																		}
																	}
																}
															}
														}

														close();
													},
												};

												if (ics20ContractAddress) {
													if (!currency.originCurrency || !('contractAddress' in currency.originCurrency)) {
														throw new Error(
															'IBC is requested to be used via cosmwam, but the provided currency does not have a contract address'
														);
													}

													const msg = {
														channel: destChannelId,
														remote_address: recipient,
														// 15 min
														timeout: 900,
													};

													await counterpartyAccount.cosmwasm.sendExecuteContractMsg(
														'ibcTransfer' as any,
														currency.originCurrency.contractAddress,
														{
															send: {
																contract: ics20ContractAddress,
																amount: amountConfig.getAmountPrimitive().amount,
																msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
															},
														},
														[],
														'',
														{
															gas: '350000',
														},
														undefined,
														txEvents
													);
												} else {
													await counterpartyAccount.cosmos.sendIBCTransferMsg(
														{
															portId: 'transfer',
															channelId: destChannelId,
															counterpartyChainId: chainStore.current.chainId,
														},
														amountConfig.amount,
														amountConfig.currency,
														recipient,
														'',
														undefined,
														undefined,
														txEvents
													);
												}
											}
										}
									} catch (e) {
										const err = e as any;

										console.log(e);

										if (err?.code === 4001) {
											displayToast(TToastType.TX_FAILED, {
												message: err.message,
											});
										}
									}
								}}>
								{(isWithdraw && account.isSendingMsg === 'ibcTransfer') ||
								(!isWithdraw && counterpartyAccount.isSendingMsg === 'ibcTransfer') ? (
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
									<h6 className="text-base md:text-lg">{isWithdraw ? 'Withdraw' : 'Deposit'}</h6>
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
