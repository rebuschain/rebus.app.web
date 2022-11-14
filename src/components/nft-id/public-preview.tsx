import React, { LegacyRef, MutableRefObject, useEffect, useRef } from 'react';
import { NftIdData, Theme } from 'src/types/nft-id';
import { IdCard } from './id-card';
import useWindowSize from 'src/hooks/use-window-size';
import { renderToImage } from 'src/utils/nft-id';

type PublicPreviewProps = {
	className?: string;
	data: NftIdData;
};

export const PublicPreview: React.FC<PublicPreviewProps> = ({ className, data }) => {
	const idCardRef = useRef<HTMLDivElement>();
	const imageRef = useRef<HTMLImageElement>();
	const { isMobileView } = useWindowSize();

	useEffect(() => {
		renderToImage(idCardRef.current as HTMLElement, dataUrl => {
			if (imageRef.current) {
				imageRef.current.src = dataUrl;
			}
		});
	}, [data]);

	return (
		<div className={className}>
			<h5 className="whitespace-nowrap mb-6">Public Preview</h5>

			<div style={{ position: 'absolute', zIndex: -1 }}>
				<IdCard data={data} ref={idCardRef as MutableRefObject<HTMLDivElement>} />
			</div>
			<img
				className="rounded-3xl overflow-hidden"
				ref={imageRef as LegacyRef<HTMLImageElement>}
				style={{ minWidth: isMobileView ? '420px' : '550px' }}
			/>
		</div>
	);
};
