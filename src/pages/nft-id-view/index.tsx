import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import env from '@beam-australia/react-env';
import axios from 'axios';
import { IdPreview } from 'src/components/nft-id/id-preview';
import { getIpfsHttpsUrl } from 'src/utils/ipfs';
import { BigLoader } from 'src/components/common/loader';
import { IPFS_TIMEOUT } from 'src/constants/nft-id';

type Params = {
	address: string;
	organization: string;
	type: string;
};

const NftIdViewPage: FunctionComponent = observer(() => {
	const { type, organization, address } = useParams<Params>();
	const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
	const [idImageDataString, setIdImageDataString] = useState('');
	const [isActive, setIsActive] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			setIsFetchingMetadata(true);

			try {
				const url = `${env('REST_URL')}/rebus/nftid/v1beta1/id_record/${type}/${organization}/${address}`;
				const { data: { id_record } = {} } = await axios.get(url);

				if (id_record?.metadata_url) {
					setIsActive(id_record.active || false);

					const { data: metadata } = await axios.get(getIpfsHttpsUrl(id_record.metadata_url), {
						timeout: IPFS_TIMEOUT,
					});
					const { data: publicImageData } = await axios.get(getIpfsHttpsUrl(metadata?.image), {
						timeout: IPFS_TIMEOUT,
					});

					setIdImageDataString(publicImageData);
				}
			} catch (error) {
				console.error('Unable to fetch NFT ID metadata', error);
			}

			setIsFetchingMetadata(false);
		})();
	}, [address, organization, type]);

	return (
		<div className="w-full h-full font-karla flex items-center justify-center py-5 px-5 pt-21 md:py-10 md:px-15">
			{isFetchingMetadata && <BigLoader />}
			{!isFetchingMetadata &&
				(idImageDataString ? (
					<IdPreview idImageDataString={idImageDataString} isActive={isActive} />
				) : (
					<div>NFT ID Not Found</div>
				))}
		</div>
	);
});

export default NftIdViewPage;
