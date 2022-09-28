import React from 'react';
import { observer } from 'mobx-react-lite';
import { MenuItem } from '@material-ui/core';
import { actions } from 'src/reducers/slices/stake/slices/claim-dialog';
import { config } from 'src/config-insync';
import SelectField from 'src/components/insync/select-field/with-children';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useStore } from 'src/stores';
import { CoinPretty, Dec } from '@keplr-wallet/unit';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

const selector = (state: RootState) => {
	return {
		value: state.stake.claimDialog.validator,
		validatorList: state.stake.validators.list,
		validatorImages: state.stake.validators.images,
	};
};

const ValidatorSelectField = observer(() => {
	const [onChange] = useActions([actions.setClaimDialogValidator]);

	const { value, validatorList, validatorImages } = useAppSelector(selector);

	const handleChange = (value: any) => {
		if (value === value) {
			return;
		}

		onChange(value);
	};

	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const queries = queriesStore.get(chainStore.current.chainId);
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const rewardsQuery = queries.cosmos.queryRewards.getQueryBech32Address(address);
	const rewards = rewardsQuery.response?.data?.result;

	let total = new CoinPretty(chainStore.current.stakeCurrency, new Dec(0));
	const totalRewards =
		rewards?.rewards?.map(value => {
			const reward = new CoinPretty(chainStore.current.stakeCurrency, value.reward?.[0]?.amount || '0');

			total = total.add(reward);

			return reward;
		}) || [];

	const totalPretty = total
		.trim(true)
		.maxDecimals(8)
		.hideDenom(true)
		.shrink(true)
		.toString();

	return (
		<SelectField id="claim_validator_select_field" name="validators" value={value} onChange={handleChange}>
			<MenuItem disabled value="none">
				Select the validator
			</MenuItem>
			{rewards &&
				rewards.rewards &&
				rewards.rewards.length &&
				rewards.rewards.map((item, index) => {
					const validator =
						item &&
						item.validator_address &&
						validatorList &&
						validatorList.length &&
						validatorList.filter(value => value.operator_address === item.validator_address);

					const image =
						validator &&
						validator.length &&
						validator[0] &&
						validator[0].description &&
						validator[0].description.identity &&
						validatorImages &&
						validatorImages.length &&
						validatorImages.filter(value => value._id === validator[0].description.identity.toString());

					return (
						<MenuItem key={item.validator_address} value={item.validator_address}>
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
									alt={
										validator &&
										validator.length &&
										validator[0] &&
										validator[0].description &&
										validator[0].description.moniker
									}
									className="image"
									src={image[0].them[0].pictures.primary.url}
								/>
							) : (
								<span className="image" style={{ background: colors[index % 6] }} />
							)}
							{validatorList &&
								validatorList.map(value => {
									if (value.operator_address === item.validator_address) {
										const rewards = new CoinPretty(chainStore.current.stakeCurrency, item.reward?.[0]?.amount || '0');
										const rewardsPretty = rewards
											.trim(true)
											.maxDecimals(8)
											.hideDenom(true)
											.shrink(true)
											.toString();

										return (
											<span key={value.operator_address}>
												{value.description && value.description.moniker}
												{rewards.toDec().gt(new Dec(0)) ? <b>&nbsp;({rewardsPretty})</b> : null}
											</span>
										);
									}

									return null;
								})}
						</MenuItem>
					);
				})}
			{totalRewards.length && (
				<MenuItem value="all">
					<span>
						All <b>&nbsp;({totalPretty})</b>
					</span>
				</MenuItem>
			)}
		</SelectField>
	);
});

export default ValidatorSelectField;
