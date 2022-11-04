import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IdForm } from 'src/components/nft-id/id-form';
import { PublicPreview } from 'src/components/nft-id/public-preview';
import { useStore } from 'src/stores';
import { NftIdData, Theme } from 'src/types/nft-id';

const NftIdPage: FunctionComponent = observer(() => {
	const history = useHistory();
	const { featureFlagStore } = useStore();

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

	useEffect(() => {
		(async () => {
			await featureFlagStore.waitResponse();

			if (!featureFlagStore.featureFlags.nftIdPage) {
				history.push('/');
			}
		})();
	}, [featureFlagStore, history]);

	return (
		<div className="flex-col-reverse w-full h-fit flex font-karla py-5 px-5 md:flex-row pt-21 md:py-10 md:px-15">
			<IdForm
				className="w-full md:w-fit md:mr-20"
				data={data}
				onChange={onChange}
				onVisibilityChange={onVisibilityChange}
			/>
			<PublicPreview className="mb-10 md:mb-0" data={data} onChangeColor={onChangeColor} />
		</div>
	);
});

export default NftIdPage;
