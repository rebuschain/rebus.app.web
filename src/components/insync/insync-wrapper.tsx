import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, FunctionComponent } from 'react';
import { useStore } from 'src/stores';
import { useActions } from 'src/hooks/use-actions';
import { config } from '../../config-insync';
import SnackbarMessage from './snackbar-message';
import { useShallowEqualSelector } from 'src/hooks/use-shallow-equal-selector';
import { delegatedValidatorsActions, validatorsActions } from 'src/reducers/slices/stake/slices';
import { RootState } from 'src/reducers/store';
import 'src/styles/insync.scss';

const selector = (state: RootState) => ({
	delegatedValidatorList: state.stake.delegatedValidators.list,
	delegatedValidatorListInProgress: state.stake.delegatedValidators.inProgress,
	validatorImages: state.stake.validators.images,
	validatorList: state.stake.validators.list,
	validatorListInProgress: state.stake.validators.inProgress,
});

export const InsyncWrapper: FunctionComponent = observer(({ children }) => {
	const { chainStore, accountStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);

	const props = useShallowEqualSelector(selector);
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
		address => {
			if (!propsRef.current.proposalTab) {
				getValidators((data: Array<any>) => {
					if (
						data &&
						data.length &&
						propsRef.current.validatorImages &&
						propsRef.current.validatorImages.length === 0
					) {
						const array = data.filter((val: any) => val && val.description && val.description.identity);
						getValidatorImage(0, array);
					}
				});
			}

			if (!address) {
				return;
			}

			if (!propsRef.current.proposalTab) {
				getDelegatedValidatorsDetails(address);
			}
		},
		[getDelegatedValidatorsDetails, getValidatorImage, getValidators]
	);

	useEffect(() => {
		document.body.classList.add('insync');
		return () => document.body.classList.remove('insync');
	}, []);

	useEffect(() => {
		fetch(address);
	}, [address, fetch]);

	return (
		<div className="of_community" style={{ height: 'fit-content', width: '100%' }}>
			{children}
			<SnackbarMessage />
		</div>
	);
});
