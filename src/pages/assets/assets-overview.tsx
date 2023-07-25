import styled from '@emotion/styled';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import { PricePretty } from '@keplr-wallet/unit/build/price-pretty';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { OverviewLabelValue } from 'src/components/common/overview-label-value';
import { TitleText } from 'src/components/texts';
import { useStore } from 'src/stores';
import useWindowSize from 'src/hooks/use-window-size';

export const AssetsOverview: FunctionComponent<React.PropsWithChildren<{ title: string }>> = observer(({ title }) => {
	const { chainStore, accountStore, queriesStore, priceStore, walletStore } = useStore();

	const { isMobileView } = useWindowSize();

	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const availableBalanceList = queries.queryBalances.getQueryBech32Address(address).balances.map(bal => bal.balance);
	const availableBalancePrice = calcTotalFiatValue(availableBalanceList);

	const spendableBalance = queries.rebus.querySpendableBalance.get(address).balance(chainStore.current.stakeCurrency);
	const spendableBalancePrice = calcTotalFiatValue([spendableBalance]);

	const delegatedBalance = queries.cosmos.queryDelegations.getQueryBech32Address(address).total;
	const unbondingBanace = queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(address).total;
	const delegatedBalancePrice = calcTotalFiatValue([delegatedBalance, unbondingBanace]);

	function calcTotalFiatValue(balanceList: CoinPretty[]) {
		let fiatValue = new PricePretty(priceStore.getFiatCurrency('usd')!, new Dec(0));
		for (const balance of balanceList) {
			const price = priceStore.calculatePrice(balance);
			if (price) {
				fiatValue = fiatValue.add(price);
			}
		}
		return fiatValue;
	}

	return (
		<section>
			<TitleText size="2xl" isMobileView={isMobileView}>
				{title}
			</TitleText>
			<AssetsList>
				<AssetsListRow>
					<OverviewLabelValue label="Total Assets">
						<TitleText size="2xl" pb={0} isMobileView={isMobileView}>
							{availableBalancePrice.add(delegatedBalancePrice).toString()}
						</TitleText>
					</OverviewLabelValue>

					<OverviewLabelValue label="Available Assets">
						<TitleText size="2xl" pb={0} isMobileView={isMobileView}>
							{availableBalancePrice.toString()}
						</TitleText>
					</OverviewLabelValue>
				</AssetsListRow>

				<AssetsListRow>
					<OverviewLabelValue label="Staked Rebus">
						<TitleText size="2xl" pb={0} isMobileView={isMobileView}>
							{delegatedBalancePrice.toString()}
						</TitleText>
					</OverviewLabelValue>

					<OverviewLabelValue label="Spendable Rebus">
						<TitleText size="2xl" pb={0} isMobileView={isMobileView}>
							{spendableBalancePrice.toString()}
						</TitleText>
					</OverviewLabelValue>
				</AssetsListRow>
			</AssetsList>
		</section>
	);
});

const AssetsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;

	@media (min-width: 768px) {
		gap: 24px;
	}

	@media (min-width: 1024px) {
		flex-direction: row;
		gap: 86px;
		align-items: center;
	}
`;

const AssetsListRow = styled.div`
	display: flex;
	gap: 36px;

	@media (min-width: 768px) {
		gap: 64px;
	}

	@media (min-width: 1024px) {
		gap: 86px;
	}
`;
