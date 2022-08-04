import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import variables from 'src/utils/variables';
import './index.scss';
import Table from './Table';
import DelegateDialog from './DelegateDialog';
import SuccessDialog from './DelegateDialog/SuccessDialog';
import UnSuccessDialog from './DelegateDialog/UnSuccessDialog';
import PendingDialog from './DelegateDialog/PendingDialog';
import { InsyncWrapper } from 'src/components/insync/InsyncWrapper';

const Stake = props => {
	const [active, setActive] = useState(1);

	const handleChange = value => {
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
								{variables[props.lang]['all_validators']}
							</p>
							<span />
							<p className={active === 3 ? 'active' : ''} onClick={() => handleChange(3)}>
								{variables[props.lang]['inactive_validators']}
							</p>
							<span />
							<p className={active === 2 ? 'active' : ''} onClick={() => handleChange(2)}>
								{variables[props.lang]['staked_validators']}
							</p>
						</div>
					</div>
					<Table active={active} />
				</div>
				<DelegateDialog />
				<SuccessDialog />
				<UnSuccessDialog />
				<PendingDialog />
			</div>
		</InsyncWrapper>
	);
};

Stake.propTypes = {
	lang: PropTypes.string.isRequired,
};

const stateToProps = state => {
	return {
		lang: state.language,
	};
};

export default connect(stateToProps)(Stake);
