import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, FunctionComponent } from 'react';
import { useStore } from 'src/stores';
import { useActions } from 'src/hooks/useActions';
import * as accounts from '../../actions/accounts';
import * as stake from '../../actions/stake';
import { config } from '../../config-insync';
import SnackbarMessage from './SnackbarMessage';
import { useShallowEqualSelector } from 'src/hooks/useShallowEqualSelector';
import 'src/styles/insync.scss';

export const InsyncWrapper: FunctionComponent = observer(({ children }) => {
	const { chainStore, accountStore, metamaskStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);

	const props = useShallowEqualSelector(state => ({
		balance: state.accounts.balance.result,
		balanceInProgress: state.accounts.balance.inProgress,
		delegations: state.accounts.delegations.result,
		delegationsInProgress: state.accounts.delegations.inProgress,
		delegatedValidatorList: state.stake.delegatedValidators.list,
		delegatedValidatorListInProgress: state.stake.delegatedValidators.inProgress,
		unBondingDelegations: state.accounts.unBondingDelegations.result,
		unBondingDelegationsInProgress: state.accounts.unBondingDelegations.inProgress,
		validatorImages: (state.stake.validators as any).images,
		validatorList: (state.stake.validators as any).list,
		validatorListInProgress: (state.stake.validators as any).inProgress,
		vestingBalance: state.accounts.vestingBalance.result,
		vestingBalanceInProgress: state.accounts.vestingBalance.inProgress,
	}));
	const propsRef = useRef(props);
	propsRef.current = props;

	const [
		setAccountAddress,
		getDelegations,
		getBalance,
		getUnBondingDelegations,
		fetchRewards,
		fetchVestingBalance,
		getDelegatedValidatorsDetails,
		getValidators,
		fetchValidatorImage,
		fetchValidatorImageSuccess,
	] = useActions([
		accounts.setAccountAddress,
		accounts.getDelegations,
		accounts.getBalance,
		accounts.getUnBondingDelegations,
		accounts.fetchRewards,
		accounts.fetchVestingBalance,
		stake.getDelegatedValidatorsDetails,
		stake.getValidators,
		stake.fetchValidatorImage,
		stake.fetchValidatorImageSuccess,
	]);

	const address = metamaskStore.isLoaded ? metamaskStore.rebusAddress : account.bech32Address;

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
				getBalance(address);
				fetchVestingBalance(address);
				fetchRewards(address);
				getUnBondingDelegations(address);
				getDelegations(address);
				getDelegatedValidatorsDetails(address);
			}
		},
		[
			fetchRewards,
			fetchVestingBalance,
			getBalance,
			getDelegatedValidatorsDetails,
			getDelegations,
			getUnBondingDelegations,
			getValidatorImage,
			getValidators,
		]
	);

	useEffect(() => {
		setAccountAddress(address);
	}, [setAccountAddress, address]);

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
