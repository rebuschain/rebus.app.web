import React, { FunctionComponent, useMemo } from 'react';
import { MenuItem } from '@mui/material';
import bigInt from 'big-integer';
import SelectField from 'src/components/insync/select-field/with-children';
import { delegateDialogActions } from 'src/reducers/slices';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

type ToValidatorSelectFieldProps = {
	canDelegateToInactive?: boolean;
};

const selector = (state: RootState) => {
	return {
		value: state.stake.delegateDialog.toValidatorAddress,
		removeValue: state.stake.delegateDialog.validatorAddress,
		validatorList: state.stake.validators.list,
		inProgress: state.stake.validators.inProgress,
		validatorImages: state.stake.validators.images,
	};
};

const ToValidatorSelectField: FunctionComponent<ToValidatorSelectFieldProps> = ({ canDelegateToInactive }) => {
	const [onChange] = useActions([delegateDialogActions.setToValidatorAddress]);
	const { value, removeValue, validatorList, validatorImages } = useAppSelector(selector);

	const handleChange = (val: string) => {
		if (value === val) {
			return;
		}

		onChange(val);
	};

	const items: any[] = useMemo(() => {
		const newList = validatorList?.slice() || [];

		// Filter active validators only if not on inactive tab
		return (
			(canDelegateToInactive
				? newList?.sort((a, b) => (bigInt(b.tokens).lesser(bigInt(a.tokens)) ? 1 : -1))
				: newList
						?.filter(item => item.status === 3)
						.sort((a, b) => (bigInt(b.tokens).lesser(bigInt(a.tokens)) ? 1 : -1))) || []
		);
	}, [canDelegateToInactive, validatorList]);

	return (
		<SelectField id="validator_select_field" name="validators" value={value} onChange={handleChange}>
			{items &&
				items.length &&
				items.map((item, index) => {
					const image =
						item &&
						item.description &&
						item.description.identity &&
						validatorImages &&
						validatorImages.length &&
						validatorImages.filter(value => value._id === item.description.identity.toString());

					return (
						removeValue !== item.operator_address && (
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
						)
					);
				})}
		</SelectField>
	);
};

export default ToValidatorSelectField;
