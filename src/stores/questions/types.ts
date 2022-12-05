export type Answer = {
	id: number;
	text: string;
};

export type UserAnswer = {
	id: number;
	answers: number[];
};

export type QuestionResponse = {
	id: number;
	attributes: {
		prompt: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		isMultipleChoice: boolean;
		answers: Answer[];
	};
};

export type Question = {
	id: number;
	prompt: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	isMultipleChoice: boolean;
	answers: Answer[];
};

export type SubmitAnswersResponse = {
	totalScore: number;
	isTotalScoreFetching: boolean;
};
