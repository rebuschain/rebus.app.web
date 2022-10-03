import React from 'react';
import { observer } from 'mobx-react-lite';
import TextField from 'src/components/insync/TextField';
import { delegateDialogActions } from 'src/reducers/slices';
import { config } from 'src/config-insync';
import variables, { Lang } from 'src/utils/variables';
import { useActions } from 'src/hooks/useActions';
import { useAppSelector } from 'src/hooks/useAppSelect';
import { RootState } from 'src/reducers/store';
import { useStore } from 'src/stores';
import { CoinPretty, Dec } from '@keplr-wallet/unit';

const COIN_DECIMALS_EXPANDED = 10 ** config.COIN_DECIMALS;
const coinDecimalsDec = new Dec(COIN_DECIMALS_EXPANDED);

const selector = (state: RootState) => {
	return {
		lang: state.language,
		tokens: state.stake.delegateDialog.tokens,
		name: state.stake.delegateDialog.name,
		selectedValidator: state.stake.delegateDialog.validatorAddress,
	};
};

const TokensTextField = observer(() => {
	const [onChange] = useActions([delegateDialogActions.setTokens]);
	const { lang, tokens, name, selectedValidator } = useAppSelector(selector);
	const value = tokens || 0;
	const valueDec = new Dec(value);

	const { accountStore, chainStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.address : account.bech32Address;
	const queries = queriesStore.get(chainStore.current.chainId);

	const delegations = queries.rebus.queryDelegations.get(address).response?.data?.result;
	const balance = queries.queryBalances.getQueryBech32Address(address).stakable.balance;

	const accountQuery = queries.rebus.queryAccount.get(address);
	const delegatedVestingBalance = accountQuery.delegatedBalance;
	const vestingBalance = accountQuery.vestingBalance;

	let stakedTokens = new CoinPretty(chainStore.current.stakeCurrency, 0);
	delegations?.forEach(currentValue => {
		stakedTokens = stakedTokens.add(new Dec(currentValue.balance.amount));
	});

	if (selectedValidator && (name === 'Undelegate' || name === 'Redelegate')) {
		const filterList = delegations?.find(
			value => value.delegation && value.delegation.validator_address === selectedValidator
		);

		if (filterList && filterList.balance && filterList.balance.amount) {
			stakedTokens = new CoinPretty(chainStore.current.stakeCurrency, new Dec(filterList.balance.amount));
		}
	}

	const vestingTokens = vestingBalance.sub(delegatedVestingBalance);

	let error = false;

	if ((name === 'Delegate' || name === 'Stake') && vestingTokens.toDec().gt(new Dec(0))) {
		error = valueDec.gt(balance.add(vestingTokens).toDec());
	} else if (name === 'Delegate' || name === 'Stake') {
		error = valueDec.gt(balance.toDec());
	} else if (name === 'Undelegate' || name === 'Redelegate') {
		error = valueDec.gt(stakedTokens.toDec());
	}

	const balancePretty = balance
		.trim(true)
		.hideDenom(true)
		.maxDecimals(8)
		.toString();

	const stakedTokensPretty = stakedTokens
		.trim(true)
		.hideDenom(true)
		.maxDecimals(8)
		.toString();

	const vestingTokensPretty = vestingTokens
		.trim(true)
		.hideDenom(true)
		.maxDecimals(8)
		.toString();

	return (
		<>
			<TextField
				error={error}
				errorText="Invalid Amount"
				id="tokens-text-field"
				name="tokens"
				type="number"
				value={tokens === null ? '' : tokens.toString()}
				onChange={onChange}
			/>
			<div className="available_tokens">
				<p className="heading">Max Available tokens:</p>
				{name === 'Delegate' || name === 'Stake' ? (
					<p className="value" onClick={() => onChange(balancePretty.replace(/,/g, ''))}>
						{balancePretty}
					</p>
				) : (name === 'Undelegate' || name === 'Redelegate') && selectedValidator ? (
					<p className="value" onClick={() => onChange(stakedTokensPretty.replace(/,/g, ''))}>
						{stakedTokensPretty}
					</p>
				) : null}
			</div>
			{vestingTokens.toDec().gt(new Dec(0)) && (name === 'Delegate' || name === 'Stake') ? (
				<div className="available_tokens">
					<p className="heading">{variables[lang]['vesting_tokens']}:</p>
					<p className="value" onClick={() => onChange(vestingTokensPretty.replace(/,/g, ''))}>
						{vestingTokensPretty}
					</p>
				</div>
			) : null}
		</>
	);
});

export default TokensTextField;
