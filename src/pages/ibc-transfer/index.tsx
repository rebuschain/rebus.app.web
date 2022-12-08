import styled from '@emotion/styled';
import { Bech32Address, ChainIdHelper } from '@keplr-wallet/cosmos';
import { WalletStatus } from '@keplr-wallet/stores';
import { IBCCurrency } from '@keplr-wallet/types';
import { Dec, DecUtils, Int } from '@keplr-wallet/unit';
import { IconButton } from '@mui/material';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Button } from 'src/components/common/button';
import { displayToast, TToastType } from 'src/components/common/toasts';
import { ConnectAccountButton } from 'src/components/connect-account-button';
import { AmountInput } from 'src/components/form/inputs';
import { EmbedChainInfos, IBCTransferInfo } from 'src/config';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/default-gas-values';
import { colorWhiteEmphasis } from 'src/emotion-styles/colors';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import useWindowSize from 'src/hooks/use-window-size';
import { useStore } from 'src/stores';
import { WalletStore } from 'src/stores/wallet';
import { AddressInput } from './address-input';

// Set counterparty to osmosis
const counterpartyChainId = EmbedChainInfos[1].chainId;

const rebusImage = '/public/assets/main/rebus-logo-single.svg';
const osmosisImage = '/public/assets/tokens/osmo.svg';

const IbcTransferPage: FunctionComponent = observer(() => {
	const history = useHistory();
	const { ibcTransferHistoryStore, chainStore, accountStore, queriesStore, walletStore, featureFlagStore } = useStore();
	const [counterpartyWalletStore] = useState(() => new WalletStore());

	useEffect(() => {
		(async () => {
			await featureFlagStore.waitResponse();

			if (!featureFlagStore.featureFlags.ibcTransferPage) {
				history.push('/');
			}
		})();
	}, [featureFlagStore, history]);

	const { isMobileView } = useWindowSize();
	const { isAccountConnected, connectAccount } = useAccountConnection();

	const [recipient, setRecipient] = useState('');
	const [isWithdraw, setIsWithdraw] = useState(true);
	const [didConfirm, setDidConfirm] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [amount, setAmount] = useState('');
	const [isMax, setIsMax] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [connectingWallet, setConnectingWallet] = useState(false);

	const account = accountStore.getAccount(chainStore.current.chainId);
	const chain = chainStore.getChain(chainStore.current.chainId);
	let senderAddress = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const counterpartyAccount = accountStore.getAccount(counterpartyChainId);
	const counterpartyChainStore = chainStore.getChain(counterpartyChainId);
	const counterpartyPrefix = isWithdraw
		? counterpartyChainStore.bech32Config.bech32PrefixAccAddr
		: chain.bech32Config.bech32PrefixAccAddr;

	// If depositing, set address to the address of the counterparty chain
	if (!isWithdraw) {
		senderAddress = counterpartyAccount.bech32Address;
	}

	const currency = chainStore.current.currencies[0];
	const counterpartyCurrency = counterpartyChainStore.currencies.find(
		curr => (curr as IBCCurrency).originCurrency?.coinMinimalDenom === config.COIN_MINIMAL_DENOM
	)!;

	const bal = queriesStore.get(chainStore.current.chainId).queryBalances.getQueryBech32Address(senderAddress);
	const counterpartyBal = queriesStore.get(counterpartyChainId).queryBalances.getQueryBech32Address(senderAddress);

	const currBal = (isWithdraw ? bal : counterpartyBal).getBalanceFromCurrency(
		isWithdraw ? currency : counterpartyCurrency
	);

	const onGetKeplAddress = () => {
		if (!isWithdraw && account.walletStatus !== WalletStatus.Loaded) {
			setConnectingWallet(true);
			connectAccount();
		} else {
			setRecipient(isWithdraw ? counterpartyAccount.bech32Address : account.bech32Address);
		}
	};

	const onGetMetamaskAddress = async () => {
		await counterpartyWalletStore.init('metamask', false, false);

		if (counterpartyWalletStore.isLoaded) {
			setRecipient(counterpartyWalletStore.rebusAddress);
		}
	};

	const swapTokens = () => {
		if (isWithdraw) {
			setRecipient(walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address);
		} else {
			setRecipient(counterpartyAccount.bech32Address);
		}

		setIsWithdraw(oldIsWithdraw => !oldIsWithdraw);
	};

	const refetchBalance = () => {
		bal.fetch();
		counterpartyBal.fetch();

		setTimeout(() => {
			bal.fetch();
			counterpartyBal.fetch();
		}, 3000);
	};

	const withdraw = async () => {
		if (walletStore.isLoaded) {
			setIsLoading(true);

			let dec = new Dec(amount);
			dec = dec.mul(DecUtils.getTenExponentNInPrecisionRange(config.COIN_DECIMALS));
			const actualAmount = dec.truncate().toString();

			const timeoutDate = new Date();
			timeoutDate.setMinutes(new Date().getMinutes() + 1);

			const timeoutTimestamp = `${timeoutDate.getTime()}000000`;

			const timeoutHeight = {
				revisionNumber: ChainIdHelper.parse(counterpartyChainId).version,
				revisionHeight: 0,
			};

			const res = await walletStore.sendIBCTransfer(
				{
					fee: {
						amount: String(BigInt(gas.ibc_transfer * config.GAS_PRICE_STEP_AVERAGE)),
						denom: currency.coinMinimalDenom,
						gas: gas.ibc_transfer.toString(),
					},
					msg: {
						sourcePort: 'transfer',
						sourceChannel: IBCTransferInfo.rebusChannelId,
						amount: actualAmount,
						denom: currency.coinMinimalDenom,
						receiver: recipient,
						revisionHeight: timeoutHeight.revisionHeight,
						revisionNumber: timeoutHeight.revisionNumber,
						timeoutTimestamp,
					},
					memo: '',
				},
				async () => {
					const destinationBlockHeight = queriesStore.get(counterpartyChainId).cosmos.queryBlock.getBlock('latest');
					await destinationBlockHeight.waitFreshResponse();
					if (destinationBlockHeight.height.equals(new Int('0'))) {
						throw new Error(`Failed to fetch the latest block of ${counterpartyChainId}`);
					}

					return destinationBlockHeight.height;
				}
			);

			const hash = res?.tx_response?.txhash;

			if (res?.tx_response?.raw_log?.includes('insufficient funds')) {
				displayToast(TToastType.TX_FAILED, {
					message: `Insufficient ${currency.coinDenom}`,
				});
			} else if (res?.tx_response?.raw_log?.includes('signature verification failed')) {
				displayToast(TToastType.TX_FAILED, {
					message: 'Metamask signature verification failed',
				});
			} else if (res?.tx_response?.code !== 0) {
				const err = res?.tx_response?.raw_log?.split(';')?.[0];

				displayToast(TToastType.TX_FAILED, {
					message: `Transfer failed${err ? `: ${err}` : ''}`,
				});
			} else if (hash) {
				displayToast(TToastType.TX_SUCCESSFUL, {
					customLink: chain.raw.explorerUrlToTx.replace('{txHash}', hash.toUpperCase()),
				});

				ibcTransferHistoryStore.pushPendingHistory({
					txHash: hash,
					sourceChainId: chainStore.current.chainId,
					sourceChannelId: IBCTransferInfo.rebusChannelId,
					destChainId: counterpartyChainId,
					destChannelId: IBCTransferInfo.osmosisChannelId,
					sequence: res?.sender?.sequence?.toString() || '',
					sender: senderAddress,
					recipient,
					amount: { amount, currency },
					timeoutHeight: timeoutHeight.revisionHeight.toString(),
					timeoutTimestamp,
				});
			}

			setIsLoading(false);
		} else if (account.isReadyToSendMsgs) {
			await account.cosmos.sendIBCTransferMsg(
				{
					portId: 'transfer',
					channelId: IBCTransferInfo.rebusChannelId,
					counterpartyChainId,
				},
				amount,
				currency,
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
							amount: { amount, currency },
							recipient,
							sender: senderAddress,
						}),
					onFulfill: tx => {
						if (!tx.code) {
							const events = tx?.events as { type: string; attributes: { key: string; value: string }[] }[] | undefined;
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
										const sequence = sequenceAttr ? Buffer.from(sequenceAttr.value, 'base64').toString() : undefined;
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
												sender: senderAddress,
												recipient,
												amount: { amount, currency },
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

		refetchBalance();
	};

	const deposit = async () => {
		const sender = counterpartyAccount.bech32Address;

		if (counterpartyAccount.isReadyToSendMsgs) {
			const txEvents = {
				onBroadcasted: (txHash: Uint8Array) =>
					ibcTransferHistoryStore.pushUncommitedHistore({
						txHash: Buffer.from(txHash).toString('hex'),
						sourceChainId: counterpartyChainId,
						destChainId: chainStore.current.chainId,
						amount: { amount, currency: counterpartyCurrency },
						sender,
						recipient,
					}),
				onFulfill: (tx: any) => {
					if (!tx.code) {
						const events = tx?.events as { type: string; attributes: { key: string; value: string }[] }[] | undefined;
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
									const sequence = sequenceAttr ? Buffer.from(sequenceAttr.value, 'base64').toString() : undefined;
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
											amount: { amount, currency: counterpartyCurrency },
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

			await counterpartyAccount.cosmos.sendIBCTransferMsg(
				{
					portId: 'transfer',
					channelId: IBCTransferInfo.osmosisChannelId,
					counterpartyChainId: chainStore.current.chainId,
				},
				amount,
				counterpartyCurrency,
				recipient,
				'',
				undefined,
				undefined,
				txEvents
			);

			refetchBalance();
		}
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();

		try {
			if (isWithdraw) {
				await withdraw();
			} else {
				await deposit();
			}
		} catch (e) {
			setIsLoading(false);

			const err = e as any;

			console.log(e);

			if (err?.code === 4001) {
				displayToast(TToastType.TX_FAILED, {
					message: err.message,
				});
			}
		}
	};

	const isDisabled = !isAccountConnected || hasError || !didConfirm;

	useEffect(() => {
		if (account.walletStatus === WalletStatus.Loaded && !isWithdraw && connectingWallet) {
			setConnectingWallet(false);
			setRecipient(account.bech32Address);
		}
	}, [account.bech32Address, account.walletStatus, connectingWallet, isWithdraw]);

	// Initialize counterparty address when wallet loads
	useEffect(() => {
		setRecipient(add => {
			if (add || !isWithdraw) {
				return add;
			}

			return counterpartyAccount.bech32Address;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [counterpartyAccount.bech32Address]);

	useEffect(() => {
		counterpartyAccount.init();
	}, [counterpartyAccount]);

	useEffect(() => {
		try {
			if (recipient) {
				Bech32Address.validate(recipient, counterpartyPrefix);
			}

			setHasError(false);
		} catch (e) {
			setHasError(true);
		}
	}, [recipient, counterpartyPrefix]);

	useEffect(() => {
		if (amount && amount[0] === '.') {
			setAmount(`0${amount}`);
		}
	}, [amount]);

	useEffect(() => {
		const currBalDec = currBal.maxDecimals(6).toDec();

		try {
			if (!currBalDec.equals(new Dec(amount?.replace(/,/g, '') || '0'))) {
				setIsMax(false);
			} else {
				setIsMax(true);
			}
		} catch (err) {
			setIsMax(false);
		}
	}, [amount, currBal, currency.coinDecimals]);

	return (
		<div className="w-full h-fit max-w-3xl text-white-high bg-surface rounded-2xl p-8 m-5 mt-21 md:my-10 mx-15 md:mt-10">
			<h6 className="mb-3 md:mb-4 text-base md:text-lg">IBC Transfer</h6>
			<section className={`flex flex-col items-center`}>
				<AddressInput
					address={senderAddress}
					chainImage={isWithdraw ? rebusImage : osmosisImage}
					chainName={isWithdraw ? chain.chainName : counterpartyChainStore.chainName}
					label="From"
				/>
				<SwapButton className="rounded-full gradient-blue" onClick={swapTokens}>
					<img src="/public/assets/icons/swap.svg" />
				</SwapButton>
				<AddressInput
					address={recipient}
					canEdit={true}
					chainImage={isWithdraw ? osmosisImage : rebusImage}
					chainName={isWithdraw ? counterpartyChainStore.chainName : chain.chainName}
					hasError={hasError}
					label="To"
					onChangeAddress={setRecipient}
					onChangeConfirm={setDidConfirm}
					onGetKeplAddress={onGetKeplAddress}
					onGetMetamaskAddress={!isWithdraw ? onGetMetamaskAddress : undefined}
				/>
			</section>
			<h6 className="text-base md:text-lg mt-7">Amount To {isWithdraw ? 'Withdraw' : 'Deposit'}</h6>
			<div className="mt-3 md:mt-4 w-full p-0 md:p-5 border-0 md:border border-secondary-50 border-opacity-60 rounded-2xl">
				<p className="text-sm md:text-base mb-2">
					Available balance:{' '}
					<span className="text-primary-50">
						{currBal
							.upperCase(true)
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
							setAmount(e.currentTarget.value);
						}}
						value={amount}
					/>
					<button
						onClick={() => {
							setIsMax(true);
							setAmount(
								currBal
									.maxDecimals(6)
									.trim(true)
									.hideDenom(true)
									.toString()
									.replace(/,/g, '')
							);
						}}
						className={classNames(
							'my-auto p-1.5 hover:opacity-75 cursor-pointer flex justify-center items-center rounded-md absolute top-2 right-2 md:static',
							!isMax && 'bg-white-faint',
							isMax && 'bg-primary-200'
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
					<Button className="w-full md:w-2/3 p-4 md:p-6 h-14" disabled={isDisabled} onClick={onSubmit}>
						{isLoading ||
						(isWithdraw && account.isSendingMsg === 'ibcTransfer') ||
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
});

const SwapButton = styled(IconButton)`
	margin: 8px !important;
	padding: 10px !important;
`;

export default IbcTransferPage;
