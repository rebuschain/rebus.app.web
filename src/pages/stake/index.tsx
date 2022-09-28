import React, { useState } from 'react';
import { InsyncWrapper } from 'src/components/insync/insync-wrapper';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from 'src/hooks/use-app-select';
import variables from 'src/utils/variables';
import Table from './table';
import DelegateDialog from './delegate-dialog';
import SuccessDialog from './delegate-dialog/success-dialog';
import UnSuccessDialog from './delegate-dialog/un-success-dialog';
import PendingDialog from './delegate-dialog/pending-dialog';
import './index.scss';

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
			<div className="stake">
				<div className="stake_content padding">
					<div className="heading">
						<div className="tabs">
							<p className={active === 1 ? 'active' : ''} onClick={() => handleChange(1)}>
								{variables[lang]['all_validators']}
							</p>
							<span />
							<p className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
								{variables[lang]['inactive_validators']}
							</p>
							<span />
							<p className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
								{variables[lang]['staked_validators']}
							</p>
						</div>
					</div>
					<Table active={active} />
				</div>
				<DelegateDialog canDelegateToInactive={active === 3} />
				<SuccessDialog />
				<UnSuccessDialog />
				<PendingDialog />
			</div>
		</InsyncWrapper>
	);
};

export default Stake;
