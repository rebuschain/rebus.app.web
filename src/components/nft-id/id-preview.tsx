import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { NftIdData } from 'src/types/nft-id';
import { IdCard } from './id-card';
import useWindowSize from 'src/hooks/use-window-size';
import { renderToImage } from 'src/utils/nft-id';
import { BigLoader } from '../common/loader';
import classNames from 'classnames';
import { ActiveDot } from './active-dot';

type IdPreviewProps = {
	className?: string;
	data?: NftIdData;
	// If this property is specified, show an inactive/active dot on the top right of the id
	isActive?: boolean;
	// If this property is specified, only an image will be rendered
	idImageDataString?: string;
	isFetchingImage?: boolean;
	onRenderPublicImage?: (image: string) => void;
	onRenderPrivateImage?: (image: string) => void;
	subtitleContent?: React.ReactElement;
	title?: string;
	titleClassName?: string;
	titleSuffix?: React.ReactElement;
};

const EMPTY_OBJ: NftIdData = {};

export const IdPreview: React.FC<React.PropsWithChildren<IdPreviewProps>> = ({
	className,
	data = EMPTY_OBJ,
	isActive,
	idImageDataString,
	isFetchingImage,
	onRenderPublicImage,
	onRenderPrivateImage,
	subtitleContent,
	title,
	titleClassName,
	titleSuffix,
}) => {
	const privateCardRef = useRef<HTMLDivElement>();
	const publicCardRef = useRef<HTMLDivElement>();
	const { isMobileView } = useWindowSize();
	const renderIteration = useRef(0);
	const [watermarkLoaded, setWatermarkLoaded] = useState(false);
	const [canRender, setCanRender] = useState(false);
	const [imageSrc, setImageSrc] = useState('');
	const [renderAttempt, setRenderAttempt] = useState(0);
	const isFirstRender = useRef(true);

	// Change this every 1second after a flag loads so we make sure to refresh the id image with the flag if by some reason the image didn't load in time
	const [flagChangeIndex, setFlagChangeIndex] = useState(0);

	// Needed since on the first render the watermark image might not be loaded yet, so the generated images won't have it
	const onWatermarkLoaded = useCallback(() => setWatermarkLoaded(true), []);
	// Used to re-render the image when the nationality flag finishes loading
	const [nationality, setNationality] = useState('');

	const onFlagLoad = useCallback((nat: string) => {
		setNationality(nat);
		setTimeout(() => setFlagChangeIndex(oldFlagIndex => oldFlagIndex + 1), 1000);
	}, []);

	useEffect(() => {
		// Give it 1 second to styles and other assets can load properly before rendering the images
		setTimeout(() => setCanRender(true), 1000);
	}, []);

	useEffect(() => {
		const currentIteration = ++renderIteration.current;

		if (typeof idImageDataString !== 'undefined' || !canRender) {
			return;
		}

		// If over 3 seconds pass, try to render again
		const timeout = setTimeout(() => setRenderAttempt(renderAttempt + 1), isFirstRender.current ? 1500 : 3000);
		isFirstRender.current = false;

		renderToImage(publicCardRef.current as HTMLElement, dataUrl => {
			clearTimeout(timeout);

			if (renderIteration.current !== currentIteration) {
				return;
			}

			setImageSrc(dataUrl);

			if (onRenderPublicImage) {
				onRenderPublicImage(dataUrl);
			}

			if (onRenderPrivateImage) {
				if (renderIteration.current !== currentIteration) {
					return;
				}

				renderToImage(privateCardRef.current as HTMLElement, dataUrl => {
					onRenderPrivateImage(dataUrl);
				});
			}
		});
	}, [
		canRender,
		data,
		data.idNumber,
		flagChangeIndex,
		idImageDataString,
		nationality,
		renderAttempt,
		onRenderPrivateImage,
		onRenderPublicImage,
		watermarkLoaded,
	]);

	return (
		<div className={className}>
			{(title || titleSuffix) && (
				<div className="flex items-center mb-4 flex-wrap">
					<h5 className={classNames('whitespace-nowrap mb-2', titleClassName)}>{title}</h5>
					{titleSuffix && <div className="mb-2">{titleSuffix}</div>}
				</div>
			)}
			{subtitleContent}

			<div className="relative">
				{typeof isActive !== 'undefined' && <ActiveDot isActive={isActive} />}

				{!idImageDataString && (
					<div style={{ overflow: 'hidden', position: 'absolute', left: 0, top: 0, zIndex: -1 }}>
						<IdCard
							className="absolute top-0"
							data={data}
							displayBlurredData={true}
							ref={privateCardRef as MutableRefObject<HTMLDivElement>}
							onFlagLoad={onFlagLoad}
							onWatermarkLoad={onWatermarkLoaded}
						/>
						<IdCard
							className="absolute top-0"
							data={data}
							ref={publicCardRef as MutableRefObject<HTMLDivElement>}
							onFlagLoad={onFlagLoad}
							onWatermarkLoad={onWatermarkLoaded}
						/>
					</div>
				)}
				{isFetchingImage || (!idImageDataString && !imageSrc) ? (
					<BigLoader
						style={{
							height: 'auto',
							margin: '64px 0',
						}}
					/>
				) : (
					<img
						className="rounded-3xl overflow-hidden"
						src={idImageDataString || imageSrc}
						style={{ minWidth: isMobileView ? '420px' : '550px' }}
					/>
				)}
			</div>
		</div>
	);
};
