import { useCallback, useEffect, useRef } from 'react';
import { useStore } from 'src/stores';
import { config } from '../config-insync';
import { useActions } from 'src/hooks/use-actions';
import { delegatedValidatorsActions, validatorsActions } from 'src/reducers/slices/stake/slices';
import { useShallowEqualSelector } from './use-shallow-equal-selector';
import { RootState } from 'src/reducers/store';
import { useAppSelector } from './use-app-select';

const selector = (state: RootState) => ({
	delegatedValidatorList: state.stake.delegatedValidators.list,
	delegatedValidatorListInProgress: state.stake.delegatedValidators.inProgress,
	validatorImages: state.stake.validators.images,
	validatorList: state.stake.validators.list,
	validatorListInProgress: state.stake.validators.inProgress,
	inProgress: state.stake.validators.inProgress,
});

export const useValidators = () => {
	const { chainStore, accountStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const props = useShallowEqualSelector(selector);
	const { delegatedValidatorList, inProgress, validatorList } = useAppSelector(selector);
	const propsRef = useRef(props);
	propsRef.current = props;

	const [getDelegatedValidatorsDetails, getValidators, fetchValidatorImage, fetchValidatorImageSuccess] = useActions([
		delegatedValidatorsActions.getDelegatedValidatorsDetails,
		validatorsActions.getValidators,
		validatorsActions.getValidatorImage,
		validatorsActions.setValidatorImageFetchSuccess,
	]);

	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const getValidatorImage = useCallback(
		(index: number, data: Array<any>) => {
			const array = [];
			for (let i = 0; i < 3; i++) {
				if (data[index + i]) {
					const value = data[index + i];
					let list = sessionStorage.getItem(`${config.PREFIX}_images`) || '{}';
					list = JSON.parse(list);
					if (value && value.description && value.description.identity && !list[value.description.identity]) {
						array.push(fetchValidatorImage(value.description.identity));
					} else if (value && value.description && value.description.identity && list[value.description.identity]) {
						fetchValidatorImageSuccess({
							...(list[value.description.identity] as any),
							_id: value.description.identity,
						});
					}
				} else {
					break;
				}
			}

			Promise.all(array).then(() => {
				if (index + 3 < data.length - 1) {
					getValidatorImage(index + 3, data);
				}
			});
		},
		[fetchValidatorImage, fetchValidatorImageSuccess]
	);

	const fetch = useCallback(
		(address: any) => {
			getValidators((data: Array<any>) => {
				if (data && data.length && propsRef.current.validatorImages && propsRef.current.validatorImages.length === 0) {
					const array = data.filter((val: any) => val && val.description && val.description.identity);
					getValidatorImage(0, array);
				}
			});

			if (!address) {
				return;
			}

			getDelegatedValidatorsDetails(address);
		},
		[getDelegatedValidatorsDetails, getValidatorImage, getValidators]
	);

	useEffect(() => {
		fetch(address);
	}, [address, fetch]);

	return { delegatedValidatorList, inProgress, validatorList };
};
