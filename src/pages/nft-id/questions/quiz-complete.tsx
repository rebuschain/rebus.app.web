import React, { FunctionComponent, useCallback } from 'react';
import { useStore } from 'src/stores';
import { Loader } from 'src/components/common/loader';
import { observer } from 'mobx-react-lite';
import quizPassed from 'src/assets/nft-id-quiz/quiz-passing.png';
import quizFailed from 'src/assets/nft-id-quiz/quiz-failed.png';
import { Button } from 'src/components/common/button';
import { styled, useTheme } from 'styled-components';
import { darkTheme } from 'src/theme';

type QuizCompleteProps = {
	creatingIdRecord?: boolean;
	hasPassed?: boolean;
	score: number;
	onClick: () => void;
};

const QuizComplete: FunctionComponent<React.PropsWithChildren<QuizCompleteProps>> = observer(
	({ creatingIdRecord, hasPassed, onClick }) => {
		const { questionsStore } = useStore();
		const theme = useTheme();
		const isDark = theme === darkTheme;

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
							<img
								alt="quiz-complete"
								src={hasPassed ? quizPassed : quizFailed}
								style={{ filter: isDark ? 'none' : 'invert(1)' }}
							/>
						</div>
						<TextStyled className="title text-center text-xl-2 py-6 leading-8">
							{hasPassed ? 'Congrats!' : 'Unfortunately, you didn’t pass.'}
						</TextStyled>
						<TextStyled className="sub-text text-center text-base text-white-mid px-8 mb-3">
							{hasPassed
								? 'You passed! You may now create your NFTID.'
								: 'Hit our docs and study up, you can try again as soon as you think you’re ready.'}
						</TextStyled>

						<Button
							backgroundStyle="secondary"
							disabled={creatingIdRecord}
							onClick={hasPassed ? onClick : onDocumentationClick}>
							{hasPassed ? 'Create NFT ID' : 'GO TO DOCUMENTATION'}
						</Button>
					</>
				)}
			</>
		);
	}
);

const TextStyled = styled.p`
	color: ${props => props.theme.text};
`;

export default QuizComplete;
