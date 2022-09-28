import { Dec } from '@keplr-wallet/unit';
import { observer } from 'mobx-react-lite';
import React, { CSSProperties, HTMLAttributes } from 'react';
import { TokenOutSwapConfig } from 'src/components/swap-token/models';
import { TokenBoxContainer, TokenBoxRow } from 'src/components/swap-token/styled-token-box';
import { TokenSelect } from 'src/components/swap-token/token-select';
import { Text, TitleText } from 'src/components/texts';
import { useBooleanStateWithWindowEvent } from 'src/hooks/use-boolean-state-with-window-event';
import useWindowSize from 'src/hooks/use-window-size';

interface Props extends HTMLAttributes<HTMLDivElement> {
	config: TokenOutSwapConfig;
	dropdownStyle?: CSSProperties;
	dropdownClassName?: string;
}

export const ToBox = observer(function ToBox({ config, dropdownClassName, dropdownStyle, ...props }: Props) {
	const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useBooleanStateWithWindowEvent(false);
	const { isMobileView } = useWindowSize();
	return (
		<TokenBoxContainer {...props}>
			<TokenBoxRow>
				<Text isMobileView={isMobileView} emphasis="medium">
					To
				</Text>
			</TokenBoxRow>
			<TokenBoxRow>
				<TokenSelect
					options={config.sendableCurrencies.filter(
						cur => cur.coinMinimalDenom !== config.sendCurrency.coinMinimalDenom
					)}
					value={config.outCurrency}
					onSelect={appCurrency => config.setOutCurrency(appCurrency.coinMinimalDenom)}
					isDropdownOpen={isTokenDropdownOpen}
					onDropdownOpen={() => setIsTokenDropdownOpen(true)}
					onDropdownClose={() => setIsTokenDropdownOpen(false)}
					dropdownStyle={dropdownStyle}
					dropdownClassName={dropdownClassName}
				/>
				<TitleText
					isMobileView={isMobileView}
					pb={0}
					style={{ opacity: config.outAmount.toDec().equals(new Dec(0)) ? 0.4 : undefined, textAlign: 'right' }}>
					{`≈ ${config.outAmount
						.trim(true)
						.maxDecimals(6)
						.shrink(true)
						.toString()}`}
				</TitleText>
			</TokenBoxRow>
		</TokenBoxContainer>
	);
});
