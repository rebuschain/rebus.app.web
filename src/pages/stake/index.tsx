import React, { useState } from 'react';
import styled from '@emotion/styled';
import { InsyncWrapper } from 'src/components/insync/insync-wrapper';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/use-app-select';
import variables from 'src/utils/variables';
import Table from './table';
import SuccessDialog from '../../dialogs/success-dialog';
import UnSuccessDialog from '../../dialogs/un-success-dialog';
import PendingDialog from '../../dialogs/pending-dialog';

const selector = (state: RootState) => {
	return {
		lang: state.language,
	};
};

const Stake = () => {
	const { lang } = useAppSelector(selector);

	const [active, setActive] = useState(1);

	const handleChange = (value: number) => {
		if (active === value) {
			return;
		}

		setActive(value);
	};

	return (
		<InsyncWrapper>
			<div className="p-5 md:py-10 md:px-15">
				<div>
					<Heading>
						<div className="flex items-start mb-3">
							<TabText className={active === 1 ? 'active' : ''} onClick={() => handleChange(1)}>
								{variables[lang]['all_validators']}
							</TabText>
							<Divider />
							<TabText className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
								{variables[lang]['inactive_validators']}
							</TabText>
							<Divider />
							<TabText className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
								{variables[lang]['staked_validators']}
							</TabText>
						</div>
					</Heading>
					<Table active={active} />
				</div>
				<SuccessDialog />
				<UnSuccessDialog />
				<PendingDialog />
			</div>
		</InsyncWrapper>
	);
};

const TabText = styled.p`
	cursor: pointer;
	font-family: Poppin, ui-sans-serif, system-ui;
	font-weight: 600;
	font-size: 24px;
	color: #ffffff80;

	&.active {
		color: #ffffff;
	}

	@media (max-width: 830px) {
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
	justify-content: center;
	margin-top: 30px;

	@media (max-width: 958px) {
		margin-top: unset;
	}

	@media (max-width: 426px) {
		overflow: auto;
	}
`;

export default Stake;
