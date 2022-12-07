import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router';
import { QUIZ_LOCKED, QUIZ_PASSED } from 'src/constants/questions';
import { useStore } from 'src/stores';
import { BigLoader } from 'src/components/common/loader';
import { PrivateView } from 'src/components/nft-id/private-view';
import SnackbarMessage from 'src/components/insync/snackbar-message';
import { Button } from 'src/components/common/button';
import { useAccountConnection } from 'src/hooks/account/use-account-connection';
import { useActions } from 'src/hooks/use-actions';
import * as extraActions from 'src/reducers/extra-actions';
import { MISC } from 'src/constants';
import { ConnectAccountButton } from '../../components/connect-account-button';
import UnSuccessDialog from '../stake/delegate-dialog/un-success-dialog';
import PendingDialog from '../stake/delegate-dialog/pending-dialog';
import SuccessDialog from '../stake/delegate-dialog/success-dialog';
import QuizPage from './questions/quiz';
import 'src/styles/insync.scss';

const cookies = new Cookies();

const NftIdPage: FunctionComponent = observer(() => {
	const [disconnect] = useActions([extraActions.disconnect]);

	const history = useHistory();
	const { accountStore, chainStore, featureFlagStore, queriesStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;

	const { connectAccount, disconnectAccount } = useAccountConnection();

	const idQuery = queries.rebus.queryIdRecord.get(address);

	const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(cookies.get(QUIZ_PASSED));
	const [isLockedOut] = useState<boolean>(cookies.get(QUIZ_LOCKED));

	// TODO: remove once we refactor dialogs
	useEffect(() => {
		document.body.classList.add('insync');
		return () => document.body.classList.remove('insync');
	}, []);
	const onQuizComplete = useCallback(() => {
		setHasCompletedQuiz(true);
	}, []);

	useEffect(() => {
		(async () => {
			await featureFlagStore.waitResponse();

			if (!featureFlagStore.featureFlags.nftIdPage) {
				history.push('/');
			}
		})();
	}, [featureFlagStore, history]);

	if (featureFlagStore.isFetching || idQuery.isFetching) {
		return <BigLoader />;
	}

	const isValidWalletType = walletStore.walletType?.includes('keplr') || walletStore.walletType === 'metamask';

	if (!address || (walletStore.isLoaded && !isValidWalletType)) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center font-karla py-5 px-5 pt-21 md:py-10 md:px-15">
				<p className="title text-center text-xl pb-6">
					{address
						? 'This wallet is not supported for the NFT ID feature'
						: 'You must be connected to your wallet to access the NFT ID feature'}
				</p>
				{address ? (
					<Button
						backgroundStyle="gradient-blue"
						onClick={e => {
							e.preventDefault();
							disconnectAccount();
							disconnect();
							queries.rebus.queryAccount.get(address).cancel();
						}}
						style={{
							width: '180px',
						}}>
						<img alt="sign-out" className="w-5 h-5" src={`${MISC.ASSETS_BASE}/icons/sign-out-secondary.svg`} />
						<p className="text-base max-w-24 ml-3 overflow-x-hidden truncate transition-all">Sign Out</p>
					</Button>
				) : (
					<ConnectAccountButton
						className="h-9"
						onClick={e => {
							e.preventDefault();
							connectAccount();
						}}
					/>
				)}
			</div>
		);
	}

	return (
		<>
			{idQuery.idRecord?.id_number || hasCompletedQuiz ? (
				<div className="w-full h-fit font-karla py-5 px-5 pt-21 md:py-10 md:px-15">
					<PrivateView />
					<SnackbarMessage />
					<SuccessDialog />
					<UnSuccessDialog />
					<PendingDialog />
				</div>
			) : (
				<QuizPage isLockedOut={isLockedOut} onComplete={onQuizComplete} />
			)}
		</>
	);
});

export default NftIdPage;
