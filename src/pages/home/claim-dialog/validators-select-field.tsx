import React from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { MenuItem } from '@material-ui/core';
import { CoinPretty, Dec } from '@keplr-wallet/unit';
import { actions } from 'src/reducers/slices/stake/slices/claim-dialog';
import SelectField from 'src/components/insync/select-field/with-children';
import { useActions } from 'src/hooks/use-actions';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';
import { useStore } from 'src/stores';

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

	const handleChange = (val: any) => {
		if (value === val) {
			return;
		}

		onChange(val);
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
			{rewards?.rewards?.map((item, index) => {
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
							<Image
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
			{Boolean(totalRewards.length) && (
				<MenuItem value="all">
					<span>
						All <b>&nbsp;({totalPretty})</b>
					</span>
				</MenuItem>
			)}
		</SelectField>
	);
});

const Image = styled.img`
	background: #696969;
	width: 30px;
	height: 30px;
	border-radius: 50px;
	margin-right: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
`;

export default ValidatorSelectField;
