import React, { useMemo } from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectField from 'src/components/insync/SelectField/WithChildren';
import { setValidator } from 'src/actions/stake';
import { MenuItem } from '@material-ui/core';
import variables from 'src/utils/variables';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const ValidatorSelectField = props => {
	const handleChange = value => {
		if (props.value === value) {
			return;
		}

		props.onChange(value);
	};

	const items = useMemo(() => {
		let validatorList = props.validatorList;

		if (props.name === 'Undelegate' || props.name === 'Redelegate') {
			validatorList = props.delegatedValidatorList;
		} else {
			// Filter active validators
			validatorList = validatorList.filter(item => item.status === 3).sort((a, b) => b.tokens - a.tokens);
		}

		return validatorList;
	}, [props.delegatedValidatorList, props.name, props.validatorList]);

	return (
		<SelectField
			id="validator_select_field"
			items={items}
			name="validators"
			placeholder={variables[props.lang]['select_validator']}
			value={props.dialogValidatorAddress || props.value}
			onChange={handleChange}>
			<MenuItem disabled value="none">
				{variables[props.lang]['select_validator']}
			</MenuItem>
			{items &&
				items.length > 0 &&
				items.map((item, index) => {
					const image =
						item &&
						item.description &&
						item.description.identity &&
						props.validatorImages &&
						props.validatorImages.length &&
						props.validatorImages.filter(value => value._id === item.description.identity.toString());

					return (
						<MenuItem
							key={item.key || item.value || item.name || item.type || item.operator_address}
							value={item.value || item.name || item.type || item.operator_address}>
							{image &&
							image.length &&
							image[0] &&
							image[0].them &&
							image[0].them.length &&
							image[0].them[0] &&
							image[0].them[0].pictures &&
							image[0].them[0].pictures.primary &&
							image[0].them[0].pictures.primary.url ? (
								<img
									alt={item.description && item.description.moniker}
									className="image"
									src={image[0].them[0].pictures.primary.url}
								/>
							) : item.description && item.description.moniker ? (
								<span className="image" style={{ background: colors[index % 6] }}>
									{item.description.moniker[0]}
								</span>
							) : (
								<span className="image" style={{ background: colors[index % 6] }} />
							)}
							{item.name ? item.name : item.type ? item.name : item.description && item.description.moniker}
						</MenuItem>
					);
				})}
		</SelectField>
	);
};

ValidatorSelectField.propTypes = {
	items: PropTypes.array.isRequired,
	lang: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	validatorImages: PropTypes.array.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	delegatedValidatorList: PropTypes.arrayOf(
		PropTypes.shape({
			operator_address: PropTypes.string,
			status: PropTypes.number,
			tokens: PropTypes.string,
			commission: PropTypes.shape({
				commission_rates: PropTypes.shape({
					rate: PropTypes.string,
				}),
			}),
			delegator_shares: PropTypes.string,
			description: PropTypes.shape({
				moniker: PropTypes.string,
			}),
		})
	),
	dialogValidatorAddress: PropTypes.string,
	inProgress: PropTypes.bool,
	validatorList: PropTypes.arrayOf(
		PropTypes.shape({
			operator_address: PropTypes.string,
			status: PropTypes.number,
			description: PropTypes.shape({
				moniker: PropTypes.string,
			}),
		})
	),
};

const stateToProps = state => {
	return {
		lang: state.language,
		items: state.stake.validator.options,
		value: state.stake.validator.value,
		validatorList: state.stake.validators.list,
		inProgress: state.stake.validators.inProgress,
		dialogValidatorAddress: state.stake.delegateDialog.address,
		name: state.stake.delegateDialog.name,
		validatorImages: state.stake.validators.images,
		delegatedValidatorList: state.stake.delegatedValidators.list,
	};
};

const actionToProps = {
	onChange: setValidator,
};

export default connect(stateToProps, actionToProps)(ValidatorSelectField);
