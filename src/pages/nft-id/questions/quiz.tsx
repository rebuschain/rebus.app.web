import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import Cookies from 'universal-cookie';
import { useStore } from 'src/stores';
import { Question } from 'src/components/nft-id/question';
import { QUIZ_ATTEMPTS, QUIZ_LOCKED, QUIZ_PASSED } from 'src/constants/questions';
import GettingStarted from './getting-started';
import QuizComplete from './quiz-complete';

type UserAnswer = {
	id: number;
	answers: number[];
};

type QuizPageProps = {
	isLockedOut: boolean;
	onComplete: () => void;
};

const cookies = new Cookies();

const QuizPage: FunctionComponent<QuizPageProps> = observer(({ isLockedOut, onComplete }) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [userScore, setUserScore] = useState<number>(0);
	const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
	const currentQuestion = currentStep - 1;
	const { questionsStore } = useStore();
	const quizQuestions = questionsStore.questions;
	let content = null;

	const handleGettingStartedClick = useCallback(() => {
		setCurrentStep(1);
	}, []);

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

	const handleQuizPassed = useCallback(() => {
		cookies.set(QUIZ_PASSED, 'true', {
			path: '/',
		});
		onComplete();
	}, [onComplete]);

	const fetchQuizResult = useCallback(
		async (answers: UserAnswer[]) => {
			const totalScore = await questionsStore.submitAnswers(answers);
			setUserScore(totalScore);

			if (totalScore < 80 && currentStep >= 5) {
				handleQuizFailed();
			}
		},
		[questionsStore, currentStep, handleQuizFailed]
	);

	useEffect(() => {
		if (currentStep === 6) {
			fetchQuizResult(userAnswers);
		}
	}, [userAnswers, currentStep, fetchQuizResult]);

	if (currentStep === 0 && !isLockedOut) {
		content = <GettingStarted onClick={handleGettingStartedClick} />;
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
	} else if (currentStep === 6 || isLockedOut) {
		content = <QuizComplete score={userScore} onClick={handleQuizPassed} />;
	}

	return (
		<div className="flex flex-col items-center justify-center p-4 pt-20 md:pt-4" style={{ maxWidth: '580px' }}>
			{content}
		</div>
	);
});

export default QuizPage;
