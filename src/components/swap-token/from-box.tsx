import styled from '@emotion/styled';
import { AppCurrency } from '@keplr-wallet/types';
import { CoinPretty, Int } from '@keplr-wallet/unit';
import { observer } from 'mobx-react-lite';
import React, { CSSProperties, HTMLAttributes, useCallback } from 'react';
import { ButtonToggle } from 'src/components/layouts/buttons';
import { CenterV } from 'src/components/layouts/containers';
import { TokenInSwapConfig } from 'src/components/swap-token/models';
import { TokenBoxContainer, TokenBoxRow } from 'src/components/swap-token/styled-token-box';
import { Text } from 'src/components/texts';
import { useBooleanStateWithWindowEvent } from 'src/hooks/use-boolean-state-with-window-event';
import { TokenAmountInput } from 'src/pages/main/components/token-amount-input';
import { useStore } from 'src/stores';
import { TokenSelect } from './token-select';
import useWindowSize from '../../hooks/use-window-size';

interface Props extends HTMLAttributes<HTMLDivElement> {
	config: TokenInSwapConfig;
	dropdownStyle?: CSSProperties;
	dropdownClassName?: string;
}

export const FromBox = observer(function FromBox({ config, dropdownStyle, dropdownClassName, ...props }: Props) {
	const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useBooleanStateWithWindowEvent(false);
	const { chainStore, accountStore, queriesStore, walletStore } = useStore();

	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.address : account.bech32Address;

	const balance = queries.queryBalances
		.getQueryBech32Address(address)
		.balances.find(bal => bal.currency.coinMinimalDenom === config.sendCurrency.coinMinimalDenom);

	const availableBalance = (() => {
		if (!balance) {
			return new CoinPretty(config.sendCurrency, new Int('0'));
		}
		return balance.balance;
	})();

	const { isMobileView } = useWindowSize();

	const handleMaxButtonToggled = useCallback(() => {
		config.toggleIsMax();
	}, [config]);

	const handleHalfButtonToggled = useCallback(() => {
		if (config.ratio === 0.5) {
			config.setRatio(undefined);
		} else {
			config.setRatio(0.5);
		}
	}, [config]);

	return (
		<TokenBoxContainer {...props}>
			<TokenBoxRow>
				<Text emphasis="medium" isMobileView={isMobileView}>
					From
				</Text>
				<CenterV>
					<CenterV>
						{!isMobileView && (
							<Text emphasis="medium" size="sm" style={{ marginRight: 8 }} isMobileView={isMobileView}>
								Available
							</Text>
						)}
						<Text color="primary" isMobileView={isMobileView}>
							{availableBalance
								.trim(true)
								.maxDecimals(6)
								.toString()}
						</Text>
					</CenterV>
					<MaxButton type="button" size="small" isActive={config.isMax} onClick={handleMaxButtonToggled}>
						<Text size="xs" emphasis="medium" style={{ lineHeight: 1.2 }} isMobileView={isMobileView}>
							MAX
						</Text>
					</MaxButton>
					<HalfButton type="button" size="small" isActive={config.ratio === 0.5} onClick={handleHalfButtonToggled}>
						<Text size="xs" emphasis="medium" style={{ lineHeight: 1.2 }} isMobileView={isMobileView}>
							HALF
						</Text>
					</HalfButton>
				</CenterV>
			</TokenBoxRow>

			<TokenBoxRow>
				<TokenSelect
					options={config.sendableCurrencies.filter(
						cur => cur.coinMinimalDenom !== config.outCurrency.coinMinimalDenom
					)}
					value={config.sendCurrency}
					onSelect={(appCurrency: AppCurrency) => config.setInCurrency(appCurrency.coinMinimalDenom)}
					isDropdownOpen={isTokenDropdownOpen}
					onDropdownClose={() => setIsTokenDropdownOpen(false)}
					onDropdownOpen={() => setIsTokenDropdownOpen(true)}
					dropdownStyle={dropdownStyle}
					dropdownClassName={dropdownClassName}
				/>
				<TokenAmountInput
					amount={config.amount}
					currency={config.sendCurrency}
					onChange={text => config.setAmount(text)}
				/>
			</TokenBoxRow>
		</TokenBoxContainer>
	);
});

const MaxButton = styled(ButtonToggle)`
	margin-left: 8px;
`;

const HalfButton = styled(MaxButton)``;