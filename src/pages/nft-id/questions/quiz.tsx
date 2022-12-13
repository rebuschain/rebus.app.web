import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import Cookies from 'universal-cookie';
import { useStore } from 'src/stores';
import { Question } from 'src/components/nft-id/question';
import { QUIZ_ATTEMPTS, QUIZ_LOCKED, QUIZ_PASSED } from 'src/constants/questions';
import GettingStarted from './getting-started';
import QuizComplete from './quiz-complete';
import { MsgCreateIdRecord } from '../../../proto/rebus/nftid/v1/tx_pb';
import { NftId } from '../../../proto/rebus/nftid/v1/id_pb';
import { config } from 'src/config-insync';
import { gas } from 'src/constants/default-gas-values';
import { aminoSignTx } from 'src/utils/helper';
import { useActions } from 'src/hooks/use-actions';
import {
	failedDialogActions,
	processingDialogActions,
	successDialogActions,
	snackbarActions,
} from 'src/reducers/slices';
import { getAccount } from 'src/utils/account';

type UserAnswer = {
	id: number;
	answers: number[];
};

type QuizPageProps = {
	isLockedOut: boolean;
};

const cookies = new Cookies();

const QuizPage: FunctionComponent<React.PropsWithChildren<QuizPageProps>> = observer(({ isLockedOut }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [userScore, setUserScore] = useState<number>(0);
	const [fetchingResult, setFetchingResult] = useState(false);
	const [fetchingAccount, setFetchingAccount] = useState(false);
	const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
	const [creatingIdRecord, setCreatingIdRecord] = useState(false);
	const currentQuestion = currentStep - 1;
	let content = null;

	const { accountStore, chainStore, queriesStore, questionsStore, walletStore } = useStore();
	const account = accountStore.getAccount(chainStore.current.chainId);
	const queries = queriesStore.get(chainStore.current.chainId);
	const address = walletStore.isLoaded ? walletStore.rebusAddress : account.bech32Address;
	const { isEvmos } = account.rebus;

	const quizQuestions = questionsStore.questions;

	const [hasPassedQuiz, setHasPassedQuiz] = useState<boolean>(cookies.get(QUIZ_PASSED(address)));

	const [failedDialog, successDialog, pendingDialog, showMessage] = useActions([
		failedDialogActions.showFailedDialog,
		successDialogActions.showSuccessDialog,
		processingDialogActions.showProcessingDialog,
		snackbarActions.showSnackbar,
	]);

	useEffect(() => {
		setHasPassedQuiz(cookies.get(QUIZ_PASSED(address)));
	}, [address]);

	const handleGettingStartedClick = useCallback(async () => {
		setFetchingAccount(true);

		let myac = null;
		try {
			myac = await getAccount(address);
		} catch {}

		if (!myac) {
			showMessage(
				'Account not found, please transfer some rebus to your account before attempting to create an NFT ID'
			);
		} else {
			setCurrentStep(1);
		}

		setFetchingAccount(false);
	}, [address, showMessage]);

	const handleQuestionCompletion = useCallback(
		(answerData: UserAnswer) => {
			const matchIndex = userAnswers.findIndex(answer => answer.id === answerData.id);
			matchIndex !== -1
				? setUserAnswers(previousAnswers => [
						...previousAnswers.filter(answer => answer.id !== answerData.id),
						answerData,
				  ])
				: setUserAnswers(previousAnswers => [...previousAnswers, answerData]);

			setCurrentStep((prevState: number) => prevState + 1);
		},
		[userAnswers]
	);

	const handlePreviousQuestionClick = useCallback(() => {
		setCurrentStep((prevState: number) => prevState - 1);
	}, []);

	const handleQuizFailed = useCallback(() => {
		const previousAttempts = localStorage.getItem(QUIZ_ATTEMPTS) || '0';
		if (previousAttempts !== null) {
			const formattedPreviousAttempts = parseInt(previousAttempts);

			if (formattedPreviousAttempts >= 2) {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				cookies.set(QUIZ_LOCKED, 'true', {
					path: '/',
					expires: tomorrow,
				});
				localStorage.setItem(QUIZ_ATTEMPTS, '0');

				return;
			}

			localStorage.setItem(QUIZ_ATTEMPTS, (formattedPreviousAttempts + 1).toString());
		}
	}, []);

	const handleQuizPassed = useCallback(async () => {
		setCreatingIdRecord(true);

		const createIdRecordMessage = new MsgCreateIdRecord();
		createIdRecordMessage.setAddress(address);
		createIdRecordMessage.setNftType(NftId.V1);
		createIdRecordMessage.setOrganization(config.NFT_ID_ORG_NAME);
		const objMessage = createIdRecordMessage.toObject();

		const msg = {
			address: objMessage.address,
			nft_type: objMessage.nftType,
			organization: objMessage.organization,
		};
		const memo = 'Create Id Record to generate unique ID Number and Document Number';

		const tx = {
			msgs: [
				{
					typeUrl: '/rebus.nftid.v1.MsgCreateIdRecord',
					value: objMessage,
				},
			],
			fee: {
				amount: [
					{
						amount: String(gas.mint_nftid * config.GAS_PRICE_STEP_AVERAGE),
						denom: config.COIN_MINIMAL_DENOM,
					},
				],
				gas: String(gas.mint_nftid),
			},
			memo,
		};
		const ethTx = {
			fee: {
				amount: String(gas.mint_nftid * config.GAS_PRICE_STEP_AVERAGE),
				denom: config.COIN_MINIMAL_DENOM,
				gas: String(gas.mint_nftid),
			},
			msg,
			memo,
		};

		let txCode = 0;
		let txHash = '';
		let txLog = '';

		try {
			if (walletStore.isLoaded) {
				const result = await walletStore.createIdRecord(ethTx, tx as any);
				txCode = result?.tx_response?.code || 0;
				txHash = result?.tx_response?.txhash || '';
				txLog = result?.tx_response?.raw_log || '';
			} else {
				const result = await aminoSignTx(tx, address, null, isEvmos);
				txCode = result?.code || 0;
				txHash = result?.transactionHash || '';
				txLog = result?.rawLog || '';
			}

			if (txCode) {
				throw new Error(txLog);
			}
		} catch (err) {
			const message = (err as any)?.message || '';

			if (message.indexOf('not yet found on the chain') > -1) {
				pendingDialog();
				return;
			}

			failedDialog({ message });
			showMessage(message);
		}

		if (txHash && !txCode) {
			successDialog({ hash: txHash, isNftIdRecord: true });
			showMessage('You can now mint an NFT ID');

			queries.queryBalances.getQueryBech32Address(address).fetch();
			queries.rebus.queryIdRecord.get(address).fetch();
		}

		setCreatingIdRecord(false);
	}, [
		address,
		failedDialog,
		isEvmos,
		pendingDialog,
		queries.queryBalances,
		queries.rebus.queryIdRecord,
		showMessage,
		successDialog,
		walletStore,
	]);

	const fetchQuizResult = useCallback(
		async (answers: UserAnswer[]) => {
			setFetchingResult(true);
			const totalScore = await questionsStore.submitAnswers(answers);
			setUserScore(totalScore);

			if (totalScore < 80 && currentStep >= 5) {
				handleQuizFailed();
			} else {
				setCurrentStep(0);
				setHasPassedQuiz(true);
				cookies.set(QUIZ_PASSED(address), 'true', {
					path: '/',
				});
			}

			setFetchingResult(false);
		},
		[questionsStore, currentStep, address, handleQuizFailed]
	);

	useEffect(() => {
		if (currentStep === 6 && !hasPassedQuiz) {
			fetchQuizResult(userAnswers);
		}
	}, [userAnswers, currentStep, fetchQuizResult, hasPassedQuiz]);

	if (currentStep === 6 || isLockedOut || hasPassedQuiz) {
		content = (
			<QuizComplete
				creatingIdRecord={creatingIdRecord}
				hasPassed={hasPassedQuiz}
				score={userScore}
				onClick={handleQuizPassed}
			/>
		);
	} else if (currentStep === 0 && !isLockedOut) {
		content = <GettingStarted disabled={fetchingAccount} onClick={handleGettingStartedClick} />;
	} else if (
		(currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4 || currentStep === 5) &&
		!isLockedOut
	) {
		content = (
			<Question
				onChange={handleQuestionCompletion}
				question={quizQuestions[currentQuestion]}
				previousClickHandler={handlePreviousQuestionClick}
				currentStep={currentStep}
			/>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center p-4 pt-20 md:pt-4" style={{ maxWidth: '580px' }}>
			{!fetchingResult && content}
		</div>
	);
});

export default QuizPage;
