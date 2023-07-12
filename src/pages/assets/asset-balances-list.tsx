import styled from '@emotion/styled';
import { AppCurrency, IBCCurrency } from '@keplr-wallet/types';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { Img } from 'src/components/common/img';
import { ButtonFaint } from 'src/components/layouts/buttons';
import { Text, TitleText } from 'src/components/texts';
import { IBCAssetInfos } from 'src/config';
import { TransferDialog } from 'src/dialogs/transfer';
import { ConvertDialog } from 'src/dialogs/convert';
import { TableData, TableHeaderRow } from 'src/pages/assets/components/table';
import { useStore } from 'src/stores';
import { makeIBCMinimalDenom } from 'src/utils/ibc';
import useWindowSize from 'src/hooks/use-window-size';
import { PricePretty } from '@keplr-wallet/unit/build/price-pretty';
import { Dec } from '@keplr-wallet/unit';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useActions } from 'src/hooks/use-actions';
import { snackbarActions } from 'src/reducers/slices';

const tableWidths = ['45%', '20%', '20%', '15%'];
const tableWidthsOnMobileView = ['35%', '32.5%', '32.5%'];

export const AssetBalancesList = observer(function AssetBalancesList() {
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const { chainStore, queriesStore, accountStore, priceStore, walletStore, featureFlagStore } = useStore();
	const { assetsPageErc20ToNative } = featureFlagStore.featureFlags;
	const { tokenPairs } = queriesStore.get(chainStore.current.chainId).rebus.queryTokenPairs.get();

	const currencyDenom = params.get('currency');
	const convertCoin = chainStore.current.currencies.find(info => info.coinMinimalDenom === currencyDenom);
	const convertCoinInfo =
		walletStore.isLoaded && !assetsPageErc20ToNative ? null : tokenPairs?.find(info => info.denom === currencyDenom);

	const { isMobileView } = useWindowSize();

	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const [showMessage] = useActions([snackbarActions.showSnackbar]);

	const ibcBalances = IBCAssetInfos.map(channelInfo => {
		const chainInfo = chainStore.getChain(channelInfo.counterpartyChainId);
		let ibcDenom = makeIBCMinimalDenom(channelInfo.sourceChannelId, channelInfo.coinMinimalDenom);

		const originCurrency = chainInfo.currencies.find(cur => {
			if (channelInfo.coinMinimalDenom.startsWith('cw20:')) {
				return cur.coinMinimalDenom.startsWith(channelInfo.coinMinimalDenom);
			}

			return cur.coinMinimalDenom === channelInfo.coinMinimalDenom;
		});

		if (!originCurrency) {
			throw new Error(`Unknown currency ${channelInfo.coinMinimalDenom} for ${channelInfo.counterpartyChainId}`);
		}

		// if this is a multihop ibc, need to special case because the denom on osmosis
		// isn't H(source_denom), but rather H(ibc_path)
		let sourceDenom = '';
		if (channelInfo.ibcTransferPathDenom) {
			ibcDenom = makeIBCMinimalDenom(channelInfo.sourceChannelId, channelInfo.ibcTransferPathDenom);
			sourceDenom = channelInfo.coinMinimalDenom;
		}

		const balance = queries.queryBalances.getQueryBech32Address(address).getBalanceFromCurrency({
			coinDecimals: originCurrency.coinDecimals,
			coinGeckoId: originCurrency.coinGeckoId,
			coinImageUrl: originCurrency.coinImageUrl,
			coinDenom: originCurrency.coinDenom,
			coinMinimalDenom: ibcDenom,
			paths: [
				{
					portId: 'transfer',
					channelId: channelInfo.sourceChannelId,
				},
			],
			originChainId: chainInfo.chainId,
			originCurrency,
		});

		return {
			chainInfo: chainInfo,
			balance,
			sourceChannelId: channelInfo.sourceChannelId,
			destChannelId: channelInfo.destChannelId,
			isUnstable: channelInfo.isUnstable,
			ics20ContractAddress: channelInfo.ics20ContractAddress,
			sourceDenom: sourceDenom,
			sourceChainId: channelInfo.counterpartyChainId,
			depositUrlOverride: channelInfo.depositUrlOverride,
			withdrawUrlOverride: channelInfo.withdrawUrlOverride,
		};
	});

	const [dialogState, setDialogState] = React.useState<
		| {
				open: true;
				currency: IBCCurrency;
				counterpartyChainId: string;
				sourceChannelId: string;
				destChannelId: string;
				isWithdraw: boolean;
				ics20ContractAddress?: string;
		  }
		| {
				open: false;
		  }
	>({ open: false });

	const close = () => setDialogState(v => ({ ...v, open: false }));

	const onDeposit = (
		currency: AppCurrency,
		sourceChainId: string,
		sourceDenom: string,
		sourceChannelId: string,
		destChainId: string,
		destChannelId: string,
		ics20ContractAddress = '',
		depositUrlOverride = ''
	) => {
		if (depositUrlOverride) {
			window.open(depositUrlOverride, '_blank');
		} else {
			let modifiedCurrency = currency;
			if (sourceDenom != '') {
				modifiedCurrency = {
					coinDecimals: currency.coinDecimals,
					coinGeckoId: currency.coinGeckoId,
					coinImageUrl: currency.coinImageUrl,
					coinDenom: currency.coinDenom,
					coinMinimalDenom: '',
					paths: (currency as IBCCurrency).paths.slice(0, 1),
					originChainId: sourceChainId,
					originCurrency: {
						coinDecimals: currency.coinDecimals,
						coinImageUrl: currency.coinImageUrl,
						coinDenom: currency.coinDenom,
						coinMinimalDenom: sourceDenom,
					},
				};
			}

			setDialogState({
				open: true,
				counterpartyChainId: destChainId,
				currency: modifiedCurrency as IBCCurrency,
				sourceChannelId: sourceChannelId,
				destChannelId,
				isWithdraw: false,
				ics20ContractAddress,
			});
		}
	};

	const onWithdraw = (
		currency: AppCurrency,
		sourceChannelId: string,
		destChainId: string,
		destChannelId: string,
		ics20ContractAddress = '',
		withdrawUrlOverride = ''
	) => {
		if (withdrawUrlOverride) {
			window.open(withdrawUrlOverride, '_blank');
		} else {
			setDialogState({
				open: true,
				counterpartyChainId: destChainId,
				currency: currency as IBCCurrency,
				sourceChannelId: sourceChannelId,
				destChannelId,
				isWithdraw: true,
				ics20ContractAddress,
			});
		}
	};

	const closeConvert = () => {
		navigate({
			search: '',
		});
	};

	const onConvert = (currency: AppCurrency, tokenAddress: string) => {
		navigate({
			search: `?currency=${currency.coinMinimalDenom}`,
		});
	};

	useEffect(() => {
		const getBalance = () => {
			if (!walletStore.isValidNetwork(walletStore.network, true)) {
				return;
			}

			chainStore.current.currencies.forEach(cur => {
				const erc20Info = tokenPairs?.find(info => info.denom === cur.coinMinimalDenom);
				const { contractAddress } = cur as any;

				if (erc20Info) {
					walletStore.getBalance(erc20Info.erc20_address, cur, true);
				} else if (contractAddress) {
					walletStore.getBalance(contractAddress, cur, true);
				}
			});
		};

		getBalance();

		const interval = setInterval(() => getBalance(), 10000);

		return () => {
			clearInterval(interval);
		};
	}, [chainStore, chainStore.current.currencies, walletStore, walletStore.network, tokenPairs]);

	const currencies = useMemo(() => {
		// TODO: Remove filtering out of OSMO when it is integrated with rebus
		const currentChainCurrencies = chainStore.current.currencies.filter(cur => !cur.coinDenom.includes('OSMO'));

		return currentChainCurrencies;
	}, [chainStore]);

	return (
		<React.Fragment>
			{dialogState.open ? (
				<TransferDialog
					dialogStyle={isMobileView ? {} : { minHeight: '533px', minWidth: '656px', maxWidth: '656px' }}
					isOpen={dialogState.open}
					close={close}
					currency={dialogState.currency}
					counterpartyChainId={dialogState.counterpartyChainId}
					sourceChannelId={dialogState.sourceChannelId}
					destChannelId={dialogState.destChannelId}
					isWithdraw={dialogState.isWithdraw}
					isMobileView={isMobileView}
					ics20ContractAddress={dialogState.ics20ContractAddress}
				/>
			) : null}
			{convertCoinInfo && convertCoin ? (
				<ConvertDialog
					dialogStyle={isMobileView ? {} : { minHeight: '533px', minWidth: '656px', maxWidth: '656px' }}
					isMobileView={isMobileView}
					isOpen
					close={closeConvert}
					currency={convertCoin}
					tokenAddress={convertCoinInfo.erc20_address}
				/>
			) : null}
			<div className="px-5 md:px-0">
				<TitleText isMobileView={isMobileView}>Assets</TitleText>
			</div>
			<table className="w-full pb-8">
				<AssetBalanceHeader isMobileView={isMobileView} />

				<tbody className="w-full">
					{currencies.map(cur => {
						const bal = queries.queryBalances.getQueryBech32Address(address).getBalanceFromCurrency(cur);
						const totalFiatValue = priceStore.calculatePrice(bal, 'usd');

						const erc20Info = tokenPairs?.find(info => info.denom === cur.coinMinimalDenom);
						const contractAddress = erc20Info?.erc20_address ?? (cur as any).contractAddress;
						const erc20Balance = walletStore.erc20BalanceMap.get(contractAddress ?? '');
						const totalErc20FiatValue = erc20Balance ? priceStore.calculatePrice(erc20Balance, 'usd') : undefined;

						return (
							<AssetBalanceRow
								key={cur.coinMinimalDenom}
								chainName=""
								coinDenom={cur.coinDenom}
								currency={cur}
								balance={bal
									.hideDenom(true)
									.trim(true)
									.maxDecimals(3)
									.toString()}
								erc20Balance={erc20Balance
									?.hideDenom(true)
									.trim(true)
									.maxDecimals(3)
									.toString()}
								totalFiatValue={totalFiatValue}
								totalErc20FiatValue={totalErc20FiatValue}
								isMobileView={isMobileView}
								onConvert={
									erc20Info?.enabled && (!walletStore.isLoaded || assetsPageErc20ToNative)
										? () => {
												onConvert(cur, erc20Info?.erc20_address ?? '');
										  }
										: undefined
								}
								suggestToken={
									contractAddress && walletStore.isEthereumSupported()
										? async () => {
												if (await walletStore.suggestToken(contractAddress!, cur)) {
													showMessage(`${cur.coinDenom} added to wallet`);
												} else {
													showMessage(`${cur.coinDenom} not added to wallet`);
												}
										  }
										: undefined
								}
							/>
						);
					})}
					{ibcBalances.map(bal => {
						const currency = bal.balance.currency;
						const coinDenom = (() => {
							if ('originCurrency' in currency && currency.originCurrency) {
								return currency.originCurrency.coinDenom;
							}

							return currency.coinDenom;
						})();

						const totalFiatValue = priceStore.calculatePrice(bal.balance, 'usd');

						return (
							<AssetBalanceRow
								key={currency.coinMinimalDenom}
								chainName={bal.chainInfo.chainName}
								coinDenom={coinDenom}
								currency={currency}
								balance={bal.balance
									.hideDenom(true)
									.trim(true)
									.maxDecimals(6)
									.toString()}
								totalFiatValue={totalFiatValue}
								onDeposit={() =>
									onDeposit(
										currency,
										bal.sourceChainId,
										bal.sourceDenom,
										bal.sourceChannelId,
										bal.chainInfo.chainId,
										bal.destChannelId,
										bal.ics20ContractAddress,
										bal.depositUrlOverride
									)
								}
								onWithdraw={() =>
									onWithdraw(
										currency,
										bal.sourceChannelId,
										bal.chainInfo.chainId,
										bal.destChannelId,
										bal.ics20ContractAddress,
										bal.withdrawUrlOverride
									)
								}
								isUnstable={bal.isUnstable}
								isMobileView={isMobileView}
							/>
						);
					})}
				</tbody>
			</table>
		</React.Fragment>
	);
});

interface AssetBalanceHeaderProps {
	isMobileView: boolean;
}

function AssetBalanceHeader({ isMobileView }: AssetBalanceHeaderProps) {
	return (
		<thead>
			<TableHeaderRow>
				<TableData style={{ width: isMobileView ? tableWidthsOnMobileView[0] : tableWidths[0] }}>
					<Text size="sm">Asset / Chain</Text>
				</TableData>
				<TableData
					className="md:!pl-4 justify-end text-right"
					style={{
						width: isMobileView ? tableWidthsOnMobileView[1] : tableWidths[1],
					}}>
					<Text size="sm">Balance</Text>
				</TableData>
				<TableData
					className="md:!pl-4 justify-end text-right"
					style={{
						width: isMobileView ? tableWidthsOnMobileView[2] : tableWidths[2],
					}}>
					<Text size="sm">ERC20 Balance</Text>
				</TableData>
				<TableData className="justify-end text-right" style={{ width: tableWidths[3] }}>
					<Text size="sm">Convert</Text>
				</TableData>

				{/* {!isMobileView && (
					<TableData style={{ width: tableWidths[4] }}>
						<Text size="sm">IBC Deposit</Text>
					</TableData>
				)}
				{!isMobileView && (
					<TableData style={{ width: tableWidths[5] }}>
						<Text size="sm">IBC Withdraw</Text>
					</TableData>
				)} */}
			</TableHeaderRow>
		</thead>
	);
}

interface AssetBalanceRowProps {
	chainName: string;
	coinDenom: string;
	currency: AppCurrency;
	balance: string;
	erc20Balance?: string;
	totalFiatValue?: PricePretty;
	totalErc20FiatValue?: PricePretty;
	onConvert?: () => void;
	onDeposit?: () => void;
	onWithdraw?: () => void;
	isUnstable?: boolean;
	showComingSoon?: boolean;
	isMobileView: boolean;
	suggestToken?: () => void;
}

function AssetBalanceRow({
	chainName,
	coinDenom,
	currency,
	balance,
	erc20Balance,
	totalFiatValue,
	totalErc20FiatValue,
	onConvert,
	onDeposit,
	onWithdraw,
	isUnstable,
	isMobileView,
	suggestToken,
}: AssetBalanceRowProps) {
	const isCW20 =
		'originCurrency' in currency && currency.originCurrency && 'contractAddress' in currency.originCurrency;

	return (
		<React.Fragment>
			<AssetBalanceRowContainer>
				<AssetBalanceTableRow>
					<TableData style={{ width: isMobileView ? tableWidthsOnMobileView[0] : tableWidths[0] }}>
						<Img
							loadingSpin
							style={{ width: `2.5rem`, height: `2.5rem`, marginRight: isMobileView ? 10 : 20 }}
							src={currency.coinImageUrl}
						/>
						<Text emphasis="medium" isMobileView={isMobileView}>
							{chainName ? `${chainName} - ${coinDenom.toUpperCase()}` : coinDenom.toUpperCase()}
						</Text>
						{isCW20 ? <div className="ml-2 px-2 py-1 rounded-full font-title text-xs bg-primary-200">CW20</div> : null}
						{suggestToken && (
							<button className="ml-2 w-6" onClick={suggestToken}>
								<img src="/public/assets/other-logos/metamask.png" alt="metamask" />
							</button>
						)}
					</TableData>
					<TableData
						className="md:!pl-3 justify-end"
						style={{
							width: isMobileView ? tableWidthsOnMobileView[1] : tableWidths[1],
						}}>
						<div className="flex flex-col items-end">
							<Text emphasis="medium" isMobileView={isMobileView}>
								{balance}
							</Text>
							{totalFiatValue && totalFiatValue.toDec().gt(new Dec(0)) ? (
								<Text size="sm">{totalFiatValue.toString()}</Text>
							) : null}
						</div>
					</TableData>
					<TableData
						className="md:!pl-3 justify-end"
						style={{
							width: isMobileView ? tableWidthsOnMobileView[2] : tableWidths[2],
						}}>
						<div className="flex flex-col items-end">
							<Text emphasis="medium" isMobileView={isMobileView}>
								{erc20Balance || '0'}
							</Text>
							{totalErc20FiatValue && totalErc20FiatValue.toDec().gt(new Dec(0)) ? (
								<Text size="sm">{totalErc20FiatValue.toString()}</Text>
							) : null}
						</div>
					</TableData>
					<TableData className="!pr-0 justify-end" style={{ width: tableWidths[3] }}>
						{onConvert ? (
							<React.Fragment>
								<div className="relative group">
									<ButtonFaint
										onClick={onConvert}
										style={{ display: 'flex', alignItems: 'center' }}
										disabled={isUnstable === true}>
										<p className="text-sm text-secondary-200 leading-none">Convert</p>
										<img alt="right" src={'/public/assets/icons/right.svg'} />
									</ButtonFaint>
								</div>
							</React.Fragment>
						) : null}
					</TableData>
					{/* {!isMobileView && (
						<TableData style={{ width: tableWidths[2] }}>
							{onDeposit ? (
								<React.Fragment>
									<div className="relative group">
										<ButtonFaint
											onClick={onDeposit}
											style={{ display: 'flex', alignItems: 'center' }}
											disabled={isUnstable === true}>
											<p className="text-sm text-secondary-200 leading-none">Deposit</p>
											<img alt="right" src={'/public/assets/icons/right.svg'} />
										</ButtonFaint>
										{isUnstable ? (
											<div
												className="absolute invisible group-hover:visible bg-black text-white-high text-center opacity-80 px-3 py-2 rounded-xl"
												style={{
													left: '50%',
													transform: 'translateX(-50%)',
													minWidth: '200px',
													bottom: '30px',
												}}>
												<span>IBC deposit/withdrawal is temporarily disabled</span>
											</div>
										) : null}
									</div>
								</React.Fragment>
							) : null}
						</TableData>
					)}
					{!isMobileView && (
						<TableData style={{ width: tableWidths[3] }}>
							{onWithdraw ? (
								<React.Fragment>
									<div className="relative group">
										<ButtonFaint
											onClick={onWithdraw}
											style={{ display: 'flex', alignItems: 'center' }}
											disabled={isUnstable === true}>
											<p className="text-sm text-secondary-200 leading-none">Withdraw</p>
											<img alt="right" src={'/public/assets/icons/right.svg'} />
										</ButtonFaint>
										{isUnstable ? (
											<div
												className="absolute invisible group-hover:visible bg-black text-white-high text-center opacity-80 px-3 py-2 rounded-xl"
												style={{
													left: '50%',
													transform: 'translateX(-50%)',
													minWidth: '200px',
													bottom: '30px',
												}}>
												<span>IBC deposit/withdrawal is temporarily disabled</span>
											</div>
										) : null}
									</div>
								</React.Fragment>
							) : null}
						</TableData>
					)} */}
				</AssetBalanceTableRow>
				{/* {isMobileView && (onWithdraw || onDeposit) && (
					<IBCTransferButtonsOnMobileView>
						{onWithdraw ? (
							<ButtonSecondary isOutlined onClick={onWithdraw} style={{ width: '100%' }} disabled={isUnstable === true}>
								<p className="text-sm text-secondary-200">Withdraw</p>
							</ButtonSecondary>
						) : null}
						{onDeposit ? (
							<ButtonSecondary onClick={onDeposit} style={{ width: '100%' }} disabled={isUnstable === true}>
								<p className="text-sm">Deposit</p>
							</ButtonSecondary>
						) : null}
					</IBCTransferButtonsOnMobileView>
				)} */}
			</AssetBalanceRowContainer>
		</React.Fragment>
	);
}

const AssetBalanceRowContainer = styled.div`
	border-bottom-width: 1px;
`;

const AssetBalanceTableRow = styled.tr`
	display: flex;
	width: 100%;
	align-items: center;
	padding-left: 14px;
	padding-right: 14px;
	@media (min-width: 768px) {
		padding-left: 30px;
		padding-right: 30px;
		max-height: 72px;
	}
`;

const IBCTransferButtonsOnMobileView = styled.div`
	display: flex;
	gap: 20px;
	padding: 10px 20px 20px;
`;
