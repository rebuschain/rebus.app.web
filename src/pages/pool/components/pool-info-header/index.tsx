import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button } from 'src/components/common/button';
import { CenterV } from 'src/components/layouts/containers';
import { Text } from 'src/components/texts';
import { HideAddLiquidityPoolIds } from 'src/config';
import { ManageLiquidityDialog } from 'src/dialogs';
import { OverviewLabelValueGridList } from 'src/pages/pool/components/pool-info-header/overview-label-value-grid-list';
import { PoolSwapDialog } from 'src/pages/pool/components/pool-info-header/pool-swap-dialog';
import { colorPrimary } from 'src/emotion-styles/colors';
import styled from '@emotion/styled';
import useWindowSize from 'src/hooks/use-window-size';
import { useStore } from 'src/stores';

interface Props {
	poolId: string;
	isLBP?: boolean;
}

export const PoolInfoHeader = observer(function PoolInfoHeader({ poolId, isLBP }: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSwapDialogOpen, setIsSwapDialogOpen] = useState(false);
	const { isMobileView } = useWindowSize();
	const { chainStore, queriesStore } = useStore();
	const queries = queriesStore.get(chainStore.currentOsmosis.chainId);
	const pool = queries.rebus.queryGammPools.getPool(poolId);

	const composition = pool?.poolAssets.reduce((str, poolAsset, i) => {
		let denom = poolAsset.amount.currency.coinDenom;
		if (denom.length >= 7) {
			denom = denom.slice(0, 7) + '...';
		}

		if (i === 0) {
			return `${str} ${denom}`;
		} else {
			return `${str} / ${denom}`;
		}
	}, ': ');

	return (
		<section>
			<ManageLiquidityDialog
				dialogStyle={!isMobileView ? { width: '656px', minHeight: '533px' } : {}}
				poolId={poolId}
				isOpen={isDialogOpen}
				close={() => setIsDialogOpen(false)}
			/>
			<PoolSwapDialog
				dialogStyle={isMobileView ? { backgroundColor: colorPrimary } : { width: '656px', minHeight: '533px' }}
				poolId={poolId}
				isOpen={isSwapDialogOpen}
				close={() => setIsSwapDialogOpen(false)}
			/>

			<PoolHeader>
				<div className="mb-2.5 md:mb-0 md:mr-6">
					<h5>
						Pool #{poolId} {composition}
					</h5>
				</div>
				<div className="flex mb-2.5 md:mb-0">
					{!HideAddLiquidityPoolIds[poolId] && (
						<div className="mr-1.5 md:mr-0 md:ml-6">
							<Button
								onClick={() => {
									setIsDialogOpen(true);
								}}>
								<Text emphasis="high" isMobileView={isMobileView}>
									Add / Remove Liquidity
								</Text>
							</Button>
						</div>
					)}
					{!isLBP ? (
						<div className="md:ml-6">
							<Button
								onClick={() => {
									setIsSwapDialogOpen(true);
								}}>
								<Text emphasis="high" isMobileView={isMobileView}>
									Swap Tokens
								</Text>
							</Button>
						</div>
					) : null}
				</div>
			</PoolHeader>

			<OverviewLabelValueGridList poolId={poolId} />
		</section>
	);
});

const PoolHeader = styled(CenterV)`
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 10px;

	@media (min-width: 768px) {
		flex-direction: row;
		align-items: center;
		margin-bottom: 24px;
	}
`;