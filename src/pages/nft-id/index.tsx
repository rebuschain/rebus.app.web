import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router';
import { ColorPicker } from 'src/components/nft-id/color-picker';
import { IdForm } from 'src/components/nft-id/id-form';
import { PublicPreview } from 'src/components/nft-id/public-preview';
import { COLOR_OPTIONS } from 'src/constants/nft-id';
import { QUIZ_LOCKED, QUIZ_PASSED } from 'src/constants/questions';
import { useStore } from 'src/stores';
import { NftIdData, Theme } from 'src/types/nft-id';
import QuizPage from './questions/quiz';

const cookies = new Cookies();

const NftIdPage: FunctionComponent = observer(() => {
	const history = useHistory();
	const { featureFlagStore } = useStore();
	const [hasCompletedQuiz, setHasCompletedQuiz] = useState<boolean>(cookies.get(QUIZ_PASSED));
	const [isLockedOut, setIsLockedOut] = useState<boolean>(cookies.get(QUIZ_LOCKED));

	// TODO: Implement data fetch/save
	const [data, setData] = useState<NftIdData>({});

	const onChange = useCallback((name, value) => {
		setData(oldData => ({ ...oldData, [name]: value }));
	}, []);
	const onChangeColor = useCallback((color: Theme) => {
		setData(oldData => ({ ...oldData, theme: color }));
	}, []);
	const onVisibilityChange = useCallback((name, value) => {
		if (name === 'cityOfBirth') {
			name = 'placeOfBirth';
		}

		setData(oldData => ({ ...oldData, [`${name}Hidden`]: value }));
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

	return (
		<>
			{hasCompletedQuiz ? (
				<div className="flex-col-reverse w-full h-fit flex font-karla py-5 px-5 md:flex-row pt-21 md:py-10 md:px-15">
					<IdForm
						className="w-full md:w-fit md:mr-20"
						data={data}
						onChange={onChange}
						onVisibilityChange={onVisibilityChange}
					/>
					<div>
						<PublicPreview className="mb-10 md:mb-0" data={data} />
						<ColorPicker
							className="mt-6"
							onChange={onChangeColor}
							options={COLOR_OPTIONS}
							value={data.theme || COLOR_OPTIONS[0]}
						/>
					</div>
				</div>
			) : (
				<QuizPage isLockedOut={isLockedOut} onComplete={onQuizComplete} />
			)}
		</>
	);
});

export default NftIdPage;
