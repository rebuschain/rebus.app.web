import styled from '@emotion/styled';
import { Dec } from '@keplr-wallet/unit';
import { observer } from 'mobx-react-lite';
import React, { HTMLAttributes } from 'react';
import { SubTitleText, Text, TitleText } from 'src/components/Texts';
import { colorPrimaryDark, colorWhiteFaint } from 'src/emotionStyles/colors';
import { useStore } from 'src/stores';
import useWindowSize from 'src/hooks/useWindowSize';

export const ActionToDescription: { [action: string]: string } = {
	stake: 'Stake $REBUS',
	wax: 'Swap Wax for Rebus', //TODO finalize what this does
	mint: 'Mint one NFTID on Rebus',
	vault: 'Use the Rebus Vault',
};

export const AirdropMissions = observer(function AirdropMissions(props: HTMLAttributes<HTMLDivElement>) {
	const { chainStore, queriesStore, accountStore } = useStore();
	const { isMobileView } = useWindowSize();

	const queries = queriesStore.get(chainStore.current.chainId);
	const account = accountStore.getAccount(chainStore.current.chainId);

	const claimRecord = queries.osmosis.queryClaimRecord.get(account.bech32Address);
	const isIneligible = claimRecord
		.initialClaimableAmountOf(chainStore.current.stakeCurrency.coinMinimalDenom)
		.toDec()
		.equals(new Dec(0));

	return (
		<AirdropMissionsContainer {...props}>
			<TitleText isMobileView={isMobileView} pb={isMobileView ? 10 : 16}>
				Missions
			</TitleText>
			<MissionCardList>
				<MissionCard
					num={0}
					complete={!isIneligible}
					description="Hold and stake Atom, Osmo or Wax on August 31st."
					ineligible={isIneligible}
					isMobileView={isMobileView}
				/>
				{Object.entries(claimRecord.completedActions).map(([action, value]) => {
					return (
						<MissionCard
							key={action}
							num={Object.keys(claimRecord.completedActions).indexOf(action) + 1}
							complete={value}
							ineligible={isIneligible}
							description={ActionToDescription[action] ?? 'Oops'}
							isMobileView={isMobileView}
						/>
					);
				})}
			</MissionCardList>
		</AirdropMissionsContainer>
	);
});

const AirdropMissionsContainer = styled.div`
	width: 100%;
	margin-top: 24px;

	@media (min-width: 768px) {
		margin-top: 48px;
	}
`;

const MissionCardList = styled.ul`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

interface MissionCardProps {
	num: number;
	description: string;
	complete: boolean;
	ineligible: boolean;
	isMobileView: boolean;
}

function MissionCard({ num, description, complete, ineligible, isMobileView }: MissionCardProps) {
	return (
		<MissionCardContainer>
			<div>
				<Text emphasis="high" pb={8} isMobileView={isMobileView}>
					Mission #{num}
				</Text>
				<SubTitleText pb={0} isMobileView={isMobileView}>
					{description}
				</SubTitleText>
			</div>
			<SubTitleText color={complete ? 'green' : 'red'} isMobileView={isMobileView}>
				{ineligible ? 'Ineligible' : complete ? 'Complete' : 'Not Complete'}
			</SubTitleText>
		</MissionCardContainer>
	);
}

const MissionCardContainer = styled.li`
	background-color: ${colorPrimaryDark};
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	border-radius: 1rem;
	border: 1px solid ${colorWhiteFaint};
	padding: 12px;

	@media (min-width: 768px) {
		padding: 20px 30px;
	}
`;
