import React, { FunctionComponent, useCallback, useState, useMemo, useEffect } from 'react';
import pickBy from 'lodash-es/pickBy';
import identity from 'lodash-es/identity';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Question as QuestionData, UserAnswer } from 'src/stores/questions/types';
import styled, { useTheme } from 'styled-components';
import { Text } from '../texts';
import { Button } from '../common/button';

type QuestionProps = {
	question: QuestionData;
	onChange: (answerData: UserAnswer) => void;
	previousClickHandler: () => void;
	currentStep: number;
};

type CheckboxStateProps = {
	[key: number]: boolean;
};

export const Question: FunctionComponent<React.PropsWithChildren<QuestionProps>> = ({
	question,
	onChange,
	currentStep,
	previousClickHandler,
}) => {
	const questionAnswerIds = useMemo(() => question.answers.map(answer => answer.id), [question]);
	const [answer, setAnswer] = useState(0);
	const [multiSelectAnswer, setMultiSelectAnswer] = useState<CheckboxStateProps>({});
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAnswer(parseInt(event.target.value));
	};

	const theme = useTheme();

	const handleMultiSelectChange = useCallback(
		(id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setMultiSelectAnswer({
				...multiSelectAnswer,
				[id]: event.target.checked,
			});
		},
		[multiSelectAnswer]
	);

	const handleNextQuestionClick = useCallback(() => {
		const userAnswer: UserAnswer = {
			id: question.id,
			answers: [],
		};

		question.isMultipleChoice
			? (userAnswer.answers = questionAnswerIds.filter(id => multiSelectAnswer[id]))
			: userAnswer.answers.push(answer);

		onChange(userAnswer);
	}, [answer, multiSelectAnswer, onChange, question, questionAnswerIds]);

	const checkIfDisabled = useCallback(
		(answerToCheck: number | CheckboxStateProps) => {
			question.isMultipleChoice
				? setIsDisabled(!questionAnswerIds.some(answerId => answerToCheck.hasOwnProperty(answerId)))
				: setIsDisabled(!questionAnswerIds.some(answerId => answerToCheck === answerId));
		},
		[question, questionAnswerIds]
	);

	useEffect(() => {
		const currentAnswers = question.isMultipleChoice ? pickBy(multiSelectAnswer, identity) : answer;

		checkIfDisabled(currentAnswers);
	}, [isDisabled, answer, multiSelectAnswer, checkIfDisabled, question]);

	return (
		<div className="flex flex-col question-wrapper">
			<FormControl className="flex w-full">
				<FormLabel
					style={{
						fontSize: '32px',
						lineHeight: '32px',
						color: theme.text,
						margin: '24px 32px',
						textAlign: 'center',
					}}
					id={`question-${question.id}-label`}>
					{question.prompt}
				</FormLabel>
				<TextStyled className="sub-text text-base text-center mb-6">
					{question.isMultipleChoice ? 'Select at least one' : 'Select only one.'}
				</TextStyled>

				<div className="flex flex-col">
					{!question.isMultipleChoice && (
						<RadioGroup name={`question-${question.id}`} value={answer} onChange={handleChange}>
							{question.answers.map(answerOption => (
								<FormControlLabel
									key={answerOption.id}
									style={{
										border: `2px solid ${theme.text}`,
										color: theme.text,
										background: theme.background,
										borderRadius: '10px',
										display: 'flex',
										margin: '2px 0px',
									}}
									control={
										<Radio
											style={{
												color: theme.text,
											}}
										/>
									}
									label={answerOption.text}
									value={answerOption.id || false}
								/>
							))}
						</RadioGroup>
					)}
					{question.isMultipleChoice && (
						<FormGroup>
							{question.answers.map(answerOption => (
								<FormControlLabel
									key={answerOption.id}
									style={{
										border: `2px solid ${theme.text}`,
										color: theme.text,
										background: theme.background,
										borderRadius: '10px',
										display: 'flex',
										margin: '2px 0px',
									}}
									control={
										<Checkbox
											checked={multiSelectAnswer[answerOption.id] || false}
											onChange={handleMultiSelectChange(answerOption.id)}
											value={answerOption.id}
											style={{
												borderRadius: '2px',
												borderWidth: '1px',
												color: theme.text,
											}}
										/>
									}
									label={answerOption.text}
								/>
							))}
						</FormGroup>
					)}
				</div>
			</FormControl>
			<div className="buttons-wrapper flex justify-between items-center mt-6">
				<Button
					backgroundStyle={'secondary'}
					onClick={previousClickHandler}
					disabled={currentStep === 1}
					style={{ minWidth: '125px' }}>
					Previous
				</Button>
				<TextStyled>{`${currentStep} of 5`}</TextStyled>
				<Button
					backgroundStyle={'secondary'}
					onClick={handleNextQuestionClick}
					disabled={isDisabled}
					style={{ minWidth: '125px' }}>
					Next
				</Button>
			</div>
		</div>
	);
};

const TextStyled = styled.p`
	color: ${props => props.theme.text};
`;

const formControlStyles = {
	border: '2px solid #FFFFFF30',
	background: '#00000030',
	borderRadius: '10px',
	display: 'flex',
	margin: '2px 0px',
};
