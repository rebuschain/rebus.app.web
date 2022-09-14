import styled from '@emotion/styled';
import { Dec } from '@keplr-wallet/unit';
import { observer } from 'mobx-react-lite';
import React, { HTMLAttributes, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubTitleText, Text, TitleText } from 'src/components/Texts';
import { colorPrimaryDark, colorWhiteFaint } from 'src/emotionStyles/colors';
import { useStore } from 'src/stores';
import useWindowSize from 'src/hooks/useWindowSize';

export const ActionToLink: { [action: string]: string } = {
	stake: '/staking',
	vote: '/proposals',
	mint: '',
	vault: '',
};

export const ActionsDisabled: { [action: string]: boolean } = {
	stake: false,
	vote: false,
	mint: true,
	vault: true,
};

export const ActionToDescription: { [action: string]: string } = {
	stake: 'Stake $REBUS',
	vote: 'Vote on a proposal',
	mint: 'Mint one NFTID on Rebus',
	vault: 'Use the Rebus Vault',
};

export const AirdropMissions = observer(function AirdropMissions(props: HTMLAttributes<HTMLDivElement>) {
	const { chainStore, queriesStore, accountStore, walletStore } = useStore();
	const { isMobileView } = useWindowSize();

	const queries = queriesStore.get(chainStore.current.chainId);
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const claimRecord = queries.rebus.queryClaimRecord.get(address);
	const isIneligible = claimRecord
		.initialClaimableAmountOf(chainStore.current.stakeCurrency.coinMinimalDenom)
		.toDec()
		.equals(new Dec(0));

	useEffect(() => {
		claimRecord.fetch();
	}, [address, claimRecord]);

	return (
		<AirdropMissionsContainer {...props}>
			<TitleText isMobileView={isMobileView} pb={isMobileView ? 10 : 16}>
				Missions
			</TitleText>
			<MissionCardList>
				<MissionCard
					num={1}
					complete={!isIneligible}
					description="Stake Atom, Evmos or Osmo on July 14th or Join our community with your Wax account until August 31st."
					ineligible={isIneligible}
					isMobileView={isMobileView}
				/>
				{Object.entries(claimRecord.completedActions).map(([action, value]) => {
					return (
						<MissionCard
							key={action}
							num={Object.keys(claimRecord.completedActions).indexOf(action) + 2}
							complete={value}
							ineligible={isIneligible}
							description={ActionToDescription[action] ?? 'Oops'}
							isMobileView={isMobileView}
							link={ActionToLink[action]}
							disabled={ActionsDisabled[action]}
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
	link?: string;
	disabled?: boolean;
}

function MissionCard({ num, description, complete, ineligible, isMobileView, link, disabled }: MissionCardProps) {
	const splitDescription = description.split(' ');
	const linkText = splitDescription[0];
	const restOfDescription = link ? ` ${splitDescription.slice(1).join(' ')}` : description;

	return (
		<MissionCardContainer>
			<div>
				<Text emphasis="high" pb={8} isMobileView={isMobileView}>
					Mission #{num}
					{disabled ? ' (COMING SOON)' : ''}
				</Text>
				<SubTitleText pb={0} isMobileView={isMobileView}>
					{link && (
						<Link className="inline hover:opacity-75 cursor-pointer" style={{ textDecoration: 'underline' }} to={link}>
							{linkText}
						</Link>
					)}
					{restOfDescription}
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
