import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useAddress } from 'src/hooks/use-address';
import variables from '../../utils/variables';
import DelegateDialog from '../stake/delegate-dialog';
import SuccessDialog from '../stake/delegate-dialog/success-dialog';
import UnSuccessDialog from '../stake/delegate-dialog/un-success-dialog';
import Table from '../stake/table';
import PendingDialog from '../stake/delegate-dialog/pending-dialog';
import { InsyncWrapper } from '../../components/insync/insync-wrapper';
import ClaimDialog from './claim-dialog';
import TokenDetails from './token-details';

type HomeProps = RouteComponentProps<any>;

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const Home = observer<HomeProps>(() => {
	const { lang } = useAppSelector(selector);
	const address = useAddress();
	const addressConnected = useRef(false);

	const [active, setActive] = useState(1);
	const langVariables = (variables as any)[lang] as { [key: string]: string };

	useEffect(() => {
		if (!address) {
			addressConnected.current = false;
			setActive(1);
		}

		if (address !== '' && !addressConnected.current) {
			addressConnected.current = true;
			setActive(2);
		}
	}, [address]);

	return (
		<InsyncWrapper>
			<Container>
				<Title>{langVariables.welcome}</Title>
				<Card>
					<TokenDetails lang={lang} />
				</Card>
			</Container>
			<div className="md:px-15 md:mb-10">
				<div>
					<Heading>
						<div className="flex items-center mb-3">
							<TabText className={active === 2 ? 'active' : ''} onClick={() => setActive(2)}>
								{variables[lang]['staked_validators']}
							</TabText>
							<Divider />
							<TabText className={active === 1 ? 'active' : ''} onClick={() => setActive(1)}>
								{variables[lang]['all_validators']}
							</TabText>
							<Divider />
							<TabText className={active === 3 ? 'active' : ''} onClick={() => setActive(3)}>
								{variables[lang]['inactive_validators']}
							</TabText>
						</div>
					</Heading>
					<Table active={active} />
				</div>
			</div>
			<DelegateDialog canDelegateToInactive={active === 3} />
			<SuccessDialog />
			<UnSuccessDialog />
			<PendingDialog />
			<ClaimDialog />
		</InsyncWrapper>
	);
});

const Container = styled.div`
	padding: 84px 20px 20px;

	@media (min-width: 768px) {
		padding: 40px 60px;
	}
`;

const Title = styled.h4`
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 36px;
	line-height: 130%;
	margin: 0 0 10px;
`;

const Card = styled.div`
	align-items: center;
	display: flex;
	justify-content: space-between;
	text-align: left;

	@media (max-width: 769px) {
		padding: 50px 0 0;
	}
`;

const TabText = styled.p`
	cursor: pointer;
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	color: #ffffff80;

	&.active {
		color: #ffffff;
	}

	@media (max-width: 769px) {
		font-size: 18px;
	}

	@media (max-width: 426px) {
		width: max-content;
	}
`;

const Divider = styled.span`
	border: 1px solid #ffffff;
	height: 20px;
	margin: 0 20px;
`;

const Heading = styled.div`
	align-items: center;
	display: flex;
	margin-top: 30px;

	@media (max-width: 958px) {
		margin-top: unset;
	}

	@media (max-width: 729px) {
		justify-content: center;
	}

	@media (max-width: 426px) {
		overflow: auto;
	}
`;

export default withRouter(Home);
