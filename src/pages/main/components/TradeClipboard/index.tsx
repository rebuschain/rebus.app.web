import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { FeesBox } from 'src/components/SwapToken/FeesBox';
import { FromBox } from 'src/components/SwapToken/FromBox';
import { ToBox } from 'src/components/SwapToken/ToBox';
import { colorPrimary, colorPrimaryLight } from 'src/emotionStyles/colors';
import { cssRaiseButtonShadow } from 'src/emotionStyles/forms';
import { useFakeFeeConfig } from 'src/hooks/tx';
import { Clip } from 'src/pages/main/components/TradeClipboard/Clip';
import { useStore } from 'src/stores';
import { useTradeConfig } from '../../hooks/useTradeConfig';
import { SwapButton } from '../SwapButton';
import { TradeTxSettings } from './TradeTxSettings';
import useWindowSize from 'src/hooks/useWindowSize';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'querystring';
import { SwapDirectionButton } from 'src/components/SwapToken/SwapDirectionButton';

export const TradeClipboard: FunctionComponent = observer(() => {
	const { chainStore, queriesStore, accountStore, swapManager, walletStore } = useStore();

	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const history = useHistory();

	let search = useLocation().search;
	if (search.startsWith('?')) {
		search = search.slice(1);
	}

	const config = useTradeConfig(
		chainStore,
		chainStore.current.chainId,
		address,
		queries.queryBalances,
		swapManager,
		queries.rebus.queryGammPools
	);
	const feeConfig = useFakeFeeConfig(
		chainStore,
		chainStore.current.chainId,
		account.msgOpts.swapExactAmountIn.gas * Math.max(config.poolIds.length, 1)
	);
	config.setFeeConfig(feeConfig);

	const query = useRef(
		queryString.parse(search) as {
			from?: string;
			to?: string;
		}
	);
	const firstEffectOccured = useRef(!search);

	useEffect(() => {
		// Update current in and out currency to query string.
		// The first effect should be ignored because the query string set when visiting the web page for the first time must be processed.
		if (firstEffectOccured.current) {
			query.current = {
				from: config.sendCurrency.coinDenom,
				to: config.outCurrency.coinDenom,
			};

			const search = queryString.stringify(query.current);

			history.replace({
				search,
			});
		} else {
			firstEffectOccured.current = true;
		}
	}, [config.sendCurrency, config.outCurrency, history]);

	useEffect(() => {
		if (query.current.from) {
			const currency =
				config.sendableCurrencies.find(cur => cur.coinDenom === query.current.from) ||
				swapManager.swappableCurrencies.find(currency => currency.coinMinimalDenom === query.current.from); // ibc hash

			if (currency) {
				config.setInCurrency(currency.coinMinimalDenom);
			}
		}

		if (query.current.to) {
			const currency =
				config.sendableCurrencies.find(cur => cur.coinDenom === query.current.to) ||
				swapManager.swappableCurrencies.find(currency => currency.coinMinimalDenom === query.current.to); // ibc hash

			if (currency) {
				config.setOutCurrency(currency.coinMinimalDenom);
			}
		}
	}, [config.sendableCurrencies, config, swapManager.swappableCurrencies]);

	const { isMobileView } = useWindowSize();

	useEffect(() => {
		for (const currency of config.sendableCurrencies) {
			// Try to get the information of all sendable currencies.
			// The currency in the token list of selector is not registered to the chain store
			// even if the currency is unknown.
			// Next line ensures that the all sendable currency would be registered to the chain store if the currnecy is unknown.
			chainStore.getChain(chainStore.current.chainId).findCurrency(currency.coinMinimalDenom);
		}
	}, [chainStore, config.sendableCurrencies]);

	return (
		<React.Fragment>
			<TradeClipboardContainer>
				<Clip />
				<TradeClipboardContent style={isMobileView ? { maxHeight: '524px' } : undefined}>
					<TradeTxSettings config={config} />

					<TradeAmountSection>
						<div>
							<FromBox config={config} />
						</div>
						<SwapDirectionButton
							onClick={e => {
								e.preventDefault();
								config.switchInAndOut();
							}}
						/>
						<div className="mt-3 md:mt-4.5">
							<ToBox config={config} />
						</div>
					</TradeAmountSection>

					<div className="mt-3 md:mt-4.5">
						<FeesBox config={config} />
					</div>

					<SwapButton config={config} />
				</TradeClipboardContent>
			</TradeClipboardContainer>
		</React.Fragment>
	);
});

const TradeClipboardContainer = styled.div`
	width: 100%;
	height: 100%;
	margin-top: 20px;
	border-radius: 1rem;
	position: relative;
	@media (min-width: 768px) {
		padding: 10px;
		border: 2px solid ${colorPrimaryLight};
		${cssRaiseButtonShadow};
		background-color: ${colorPrimary};
	}
`;

const TradeClipboardContent = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	background-color: ${colorPrimaryLight};
	border-radius: 0.375rem;
	z-index: 0;
	padding: 10px 10px 14px;
	display: flex;
	flex-direction: column;
	@media (min-width: 768px) {
		padding: 20px 20px 30px;
	}
`;

const TradeAmountSection = styled.section`
	position: relative;
	width: 100%;
	margin-top: 12px;
	@media (min-width: 768px) {
		margin-top: 18px;
	}
`;
