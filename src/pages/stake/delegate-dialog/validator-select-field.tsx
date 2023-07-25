import React, { FunctionComponent, useMemo } from 'react';
import bigInt from 'big-integer';
import SelectField from 'src/components/insync/select-field/with-children';
import { delegateDialogActions } from 'src/reducers/slices';
import { MenuItem } from '@mui/material';
import variables from 'src/utils/variables';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { sortValidators } from 'src/utils/format';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

type ValidatorSelectFieldProps = {
	canDelegateToInactive?: boolean;
};

const selector = (state: RootState) => {
	return {
		lang: state.language,
		value: state.stake.delegateDialog.validatorAddress,
		validatorList: state.stake.validators.list,
		inProgress: state.stake.validators.inProgress,
		name: state.stake.delegateDialog.name,
		validatorImages: state.stake.validators.images,
		delegatedValidatorList: state.stake.delegatedValidators.list,
	};
};

const ValidatorSelectField: FunctionComponent<React.PropsWithChildren<ValidatorSelectFieldProps>> = ({
	canDelegateToInactive,
}) => {
	const [onChange] = useActions([delegateDialogActions.setValidatorAddress]);
	const { lang, value, validatorList, name, validatorImages, delegatedValidatorList } = useAppSelector(selector);

	const handleChange = (val: string) => {
		if (value === val) {
			return;
		}

		onChange(val);
	};

	const items = useMemo(() => {
		let parsedValidatorList = validatorList?.slice() || [];

		if (name === 'Undelegate' || name === 'Redelegate') {
			parsedValidatorList = delegatedValidatorList;
		} else {
			// Filter active validators only if not on inactive tab
			parsedValidatorList = canDelegateToInactive
				? sortValidators(parsedValidatorList)
				: sortValidators(parsedValidatorList?.filter(item => item.status === 3)) || [];
		}

		return parsedValidatorList;
	}, [canDelegateToInactive, delegatedValidatorList, name, validatorList]);

	return (
		<SelectField
			id="validator_select_field"
			name="validators"
			placeholder={variables[lang]['select_validator']}
			value={value}
			onChange={handleChange}>
			<MenuItem disabled value="none">
				{variables[lang]['select_validator']}
			</MenuItem>
			{items &&
				items.length > 0 &&
				items.map((item, index) => {
					const image =
						item &&
						item.description &&
						item.description.identity &&
						validatorImages &&
						validatorImages.length &&
						validatorImages.filter(value => value._id === item.description.identity.toString());

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

export default ValidatorSelectField;
