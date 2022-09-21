import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { DisplayLeftTime } from 'src/components/common/DisplayLeftTime';
import { OverviewLabelValue } from 'src/components/common/OverviewLabelValue';
import { SubTitleText, TitleText } from 'src/components/Texts';
import { useStore } from 'src/stores';
import useWindowSize from 'src/hooks/useWindowSize';
import { LINKS } from 'src/constants/links';

export const AirdropOverview = observer(function AirdropOverview() {
	const { chainStore, accountStore, queriesStore, walletStore } = useStore();
	const { isMobileView } = useWindowSize();

	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const totalClaimableQuery = queries.rebus.queryTotalClaimable.get(address);
	const unclaimed = totalClaimableQuery.amountOf(chainStore.current.stakeCurrency.coinMinimalDenom);

	const claimRecord = queries.rebus.queryClaimRecord.get(address);
	const totalClaimable = claimRecord.initialClaimableAmountOf(chainStore.current.stakeCurrency.coinMinimalDenom);

	useEffect(() => {
		claimRecord.fetch();
		totalClaimableQuery.fetch();
	}, [address, claimRecord, totalClaimableQuery]);

	return (
		<AirdropOverviewContainer>
			<TitleText size="2xl" isMobileView={isMobileView}>
				Claim Airdrop
			</TitleText>
			<OverviewList>
				<OverviewLabelValue label="Unclaimed Airdrop">
					<span>
						<TitleText size="2xl" isMobileView={isMobileView} style={{ display: 'inline' }}>
							{unclaimed
								.trim(true)
								.shrink(true)
								.hideDenom(true)
								.toString()}
						</TitleText>
						<SubTitleText isMobileView={isMobileView} style={{ display: 'inline' }}>
							{' '}
							{unclaimed.currency.coinDenom}
						</SubTitleText>
					</span>
				</OverviewLabelValue>
				<OverviewLabelValue label="Claimed Airdrop">
					<span>
						<TitleText size="2xl" isMobileView={isMobileView} style={{ display: 'inline' }}>
							{totalClaimable
								.sub(unclaimed)
								.trim(true)
								.shrink(true)
								.hideDenom(true)
								.toString()}
						</TitleText>
						<SubTitleText isMobileView={isMobileView} style={{ display: 'inline' }}>
							{' '}
							{unclaimed.currency.coinDenom}
						</SubTitleText>
					</span>
				</OverviewLabelValue>
				<DisplayCliff />
			</OverviewList>
			<TitleText className="mt-10" size="lg" isMobileView={isMobileView}>
				If you have any issues with the Airdrop please fill out&nbsp;
				<a
					href="https://docs.google.com/forms/d/e/1FAIpQLSdG-qnmcYS80rXSvkAXHf5KzOx6JoQQ4PfO-SRNX2hqHgF4iQ/viewform"
					target="_blank"
					rel="noreferrer"
					style={{ textDecoration: 'underline' }}>
					this form
				</a>
				&nbsp;or join our&nbsp;
				<a href={LINKS.TELEGRAM} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
					telegram
				</a>
				&nbsp;or&nbsp;
				<a href={LINKS.DISCORD} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
					discord
				</a>
				&nbsp;communities
			</TitleText>
		</AirdropOverviewContainer>
	);
});

const AirdropOverviewContainer = styled.section`
	width: 100%;
`;

const OverviewList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;

	@media (min-width: 768px) {
		flex-direction: row;
		gap: 80px;
	}
`;

const DisplayCliff = observer(function DisplayCliff() {
	const { chainStore, queriesStore } = useStore();

	const queries = queriesStore.get(chainStore.current.chainId);

	const [dummy, setRerender] = React.useState(true);
	useEffect(() => {
		const interval = setInterval(() => {
			setRerender(v => !v);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const timeUntilClaim = queries.rebus.queryClaimParams.timeUntilClaim;
	const timeUntilEnd = queries.rebus.queryClaimParams.timeUntilEnd;

	const claimStarted = dayjs(timeUntilClaim).isBefore(Date.now());

	const untilClaim = formatTimeUntil(timeUntilClaim);
	const untilEnd = formatTimeUntil(timeUntilEnd);

	const [day, hour, minute] = claimStarted ? untilEnd.split('-') : untilClaim.split('-');

	return (
		<OverviewLabelValue label={claimStarted ? 'Time until Claim Ends' : 'Time to Start Claim'}>
			<DisplayLeftTime day={day} hour={hour} minute={minute} />
		</OverviewLabelValue>
	);
});

function formatTimeUntil(date: Date) {
	const delta = dayjs.duration(dayjs(date).diff(dayjs(new Date()), 'second'), 'second');
	if (delta.asSeconds() <= 0) {
		return '00-00-00';
	}
	return `${padTwoDigit(delta.months() * 30 + delta.days())}-${padTwoDigit(delta.hours())}-${padTwoDigit(
		delta.minutes()
	)}`;
}

function padTwoDigit(num: number): string {
	// Expect that num is integer
	if (num <= 0) {
		return '00';
	}
	if (num <= 9) {
		return '0' + num;
	}
	return num.toString();
}
