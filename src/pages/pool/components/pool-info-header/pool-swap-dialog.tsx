import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { FromBox } from 'src/components/swap-token/from-box';
import { SwapDirectionButton } from 'src/components/swap-token/swap-direction-button';
import { TitleText } from 'src/components/texts';
import { wrapBaseDialog } from 'src/dialogs';
import { colorPrimary } from 'src/emotion-styles/colors';
import { useFakeFeeConfig } from 'src/hooks/tx';
import { ToBox } from 'src/components/swap-token/to-box';
import { FeesBox } from 'src/components/swap-token/fees-box';
import { SwapButton } from 'src/pages/pool/components/pool-info-header/swap-button';
import { PoolSwapConfig, usePoolSwapConfig } from 'src/pages/pool/components/pool-info-header/use-pool-swap-config';
import { useStore } from 'src/stores';
import useWindowSize from 'src/hooks/use-window-size';

interface PoolSwapDialogProps {
	poolId: string;
	close: () => void;
}

export const PoolSwapDialog = wrapBaseDialog(
	observer(function PoolSwapDialog({ poolId, close }: PoolSwapDialogProps) {
		const { chainStore, queriesStore, accountStore, walletStore } = useStore();
		const { isMobileView } = useWindowSize();

		const account = accountStore.getAccount(chainStore.currentOsmosis.chainId);
		const queries = queriesStore.get(chainStore.currentOsmosis.chainId);
		const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

		const config = usePoolSwapConfig(
			chainStore,
			chainStore.currentOsmosis.chainId,
			address,
			queries.queryBalances,
			poolId,
			queries.rebus.queryGammPools
		);
		const feeConfig = useFakeFeeConfig(
			chainStore,
			chainStore.currentOsmosis.chainId,
			account.msgOpts.swapExactAmountIn.gas
		);
		config.setFeeConfig(feeConfig);

		return (
			<PoolSwapDialogContainer>
				<TitleText isMobileView={isMobileView} pb={isMobileView ? 16 : 30}>
					Swap Tokens
				</TitleText>
				<PoolSwapClipboardContent config={config} />
			</PoolSwapDialogContainer>
		);
	})
);

export const PoolSwapClipboardContent: FunctionComponent<{
	config: PoolSwapConfig;
}> = observer(({ config }) => {
	const { isMobileView } = useWindowSize();

	return (
		<PoolSwapDialogContent>
			<PairContainer>
				<div>
					<FromBox config={config} dropdownStyle={isMobileView ? { width: 'calc(100vw - 72px)' } : {}} />
				</div>
				<SwapDirectionButton
					onClick={e => {
						e.preventDefault();
						config.switchInAndOut();
					}}
				/>
				<div className="mt-3 md:mt-4.5">
					<ToBox config={config} dropdownStyle={isMobileView ? { width: 'calc(100vw - 72px)' } : {}} />
				</div>
			</PairContainer>

			<div className="mt-3 md:mt-4.5">
				<FeesBox config={config} />
			</div>

			<SwapButton config={config} close={close} />
		</PoolSwapDialogContent>
	);
});

const PoolSwapDialogContainer = styled.section`
	width: 100%;
	margin-left: auto;
	margin-right: auto;
`;

const PoolSwapDialogContent = styled.div`
	@media (min-width: 768px) {
		border-radius: 0.75rem;
		background-color: ${colorPrimary};
		padding: 24px 30px;
	}
`;

const PairContainer = styled.div`
	position: relative;
`;
