import { computed, makeObservable, observable } from 'mobx';
import env from '@beam-australia/react-env';
import axios from 'axios';
import { ObservableQuery } from '@keplr-wallet/stores';
import { KVStore } from '@keplr-wallet/common';
import { UserAnswer, QuestionResponse, Question } from './types';

const axiosInstance = axios.create({
	baseURL: `${env('CMS_URL')}/api`,
});

/**
 * QuestionsStore
 */
export class QuestionsStore extends ObservableQuery<QuestionResponse[]> {
	@observable
	public totalScore = 0;
	@observable
	public isTotalScoreFetching = false;

	constructor(kvStore: KVStore) {
		super(kvStore, axiosInstance, '/questions?amount=5');
		makeObservable(this);
	}

	@computed
	public get questions(): Question[] {
		return this.response?.data?.map(({ id, attributes }) => ({ id, ...attributes })) || [];
	}

	async submitAnswers(answers: UserAnswer[]) {
		this.isTotalScoreFetching = true;
		const { data } = await axiosInstance.post('/questions/score', { answers });

		this.isTotalScoreFetching = false;
		this.totalScore = data;

		return this.totalScore;
	}
}
