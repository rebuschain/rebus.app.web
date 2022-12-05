import React, { FunctionComponent, useCallback } from 'react';
import { useStore } from 'src/stores';
import { Loader } from 'src/components/common/loader';
import { PASSING_SCORE } from 'src/constants/questions';
import { observer } from 'mobx-react-lite';
import quizPassed from 'src/assets/nft-id-quiz/quiz-passing.png';
import quizFailed from 'src/assets/nft-id-quiz/quiz-failed.png';

type QuizCompleteProps = {
	score: number;
	onClick: () => void;
};

const QuizComplete: FunctionComponent<QuizCompleteProps> = observer(({ score, onClick }) => {
	const { questionsStore } = useStore();
	const hasPassed = score >= PASSING_SCORE;

	const onDocumentationClick = useCallback(() => {
		window.open('https://medium.com/@RebusChain/nftid-nifdy-a-new-take-on-identity-with-rebus-76cb074a1dba');
	}, []);

	return (
		<>
			{questionsStore.isTotalScoreFetching ? (
				<Loader />
			) : (
				<>
					<div className="image-wrapper">
						<img alt="quiz-complete" src={hasPassed ? quizPassed : quizFailed} />
					</div>
					<p className="title text-center text-xl-2 py-6 leading-8">
						{hasPassed ? 'Congrats!' : 'Unfortunately, you didn’t pass.'}
					</p>
					<p className="sub-text text-center text-base text-white-mid px-8">
						{hasPassed
							? 'You passed! You may now create your NFTID.'
							: 'Hit our docs and study up, you can try again as soon as you think you’re ready.'}
					</p>

					<button onClick={hasPassed ? onClick : onDocumentationClick} className="bg-blue1 py-2 px-10 rounded-lg mt-6">
						{hasPassed ? 'Create NFT ID' : 'GO TO DOCUMENTATION'}
					</button>
				</>
			)}
		</>
	);
});

export default QuizComplete;
