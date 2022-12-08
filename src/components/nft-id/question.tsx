import React, { FunctionComponent, useCallback, useState, useMemo, useEffect } from 'react';
import pickBy from 'lodash-es/pickBy';
import identity from 'lodash-es/identity';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';
import { Question as QuestionData, UserAnswer } from 'src/stores/questions/types';

type QuestionProps = {
	question: QuestionData;
	onChange: (answerData: UserAnswer) => void;
	previousClickHandler: () => void;
	currentStep: number;
};

type CheckboxStateProps = {
	[key: number]: boolean;
};

const formControlStyles = {
	border: '2px solid #FFFFFF30',
	background: '#00000030',
	borderRadius: '10px',
	display: 'flex',
	margin: '2px 0px',
};

export const Question: FunctionComponent<QuestionProps> = ({
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
						color: '#FFFFFF',
						margin: '24px 32px',
						textAlign: 'center',
					}}
					id={`question-${question.id}-label`}>
					{question.prompt}
				</FormLabel>
				<p className="sub-text text-white-mid text-base text-center mb-6">
					{question.isMultipleChoice ? 'Select at least one' : 'Select only one.'}
				</p>

				<div className="flex flex-col">
					{!question.isMultipleChoice && (
						<RadioGroup name={`question-${question.id}`} value={answer} onChange={handleChange}>
							{question.answers.map(answerOption => (
								<FormControlLabel
									key={answerOption.id}
									style={formControlStyles}
									control={
										<Radio
											style={{
												color: '#FFFFFF',
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
									style={formControlStyles}
									control={
										<Checkbox
											checked={multiSelectAnswer[answerOption.id] || false}
											onChange={handleMultiSelectChange(answerOption.id)}
											value={answerOption.id}
											style={{
												borderRadius: '2px',
												borderWidth: '1px',
												color: '#FFFFFF',
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
				<button
					className="bg-blue1 py-2 px-3.75 w-24 rounded-lg focus:outline-none disabled:bg-white-disabled disabled:opacity-50"
					onClick={previousClickHandler}
					disabled={currentStep === 1}>
					Previous
				</button>
				<p>{`${currentStep} of 5`}</p>
				<button
					disabled={isDisabled}
					onClick={handleNextQuestionClick}
					className="bg-blue1 py-2 px-3.75 w-24 rounded-lg disabled:bg-white-disabled disabled:opacity-50">
					Next
				</button>
			</div>
		</div>
	);
};
