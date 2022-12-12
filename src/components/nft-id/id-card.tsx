import React, { forwardRef, useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import countries from 'svg-country-flags/countries.json';
import { NftIdData } from 'src/types/nft-id';
import { DataItem } from './data-item';
import styled from '@emotion/styled';
import trianglify from 'trianglify';
import { COLOR_OPTIONS } from 'src/constants/nft-id';
import classNames from 'classnames';
import { useAddress } from 'src/hooks/use-address';

type IdCardProps = {
	className?: string;
	data: NftIdData;
	displayBlurredData?: boolean;
	onWatermarkLoad?: () => void;
};

const countriesToAbbvMap = Object.entries(countries).reduce((map, [abbv, country]) => {
	map[country] = abbv;
	return map;
}, {} as Record<string, string>);

const getBackgroundLevel = (data: NftIdData) => {
	let level = 8;

	if (data.name) {
		level--;
	}

	if (data.dateOfBirth && data.dateOfBirth !== 'Invalid Date' && data.gender) {
		level--;
	}

	if (data.cityOfBirth && data.stateOfBirth) {
		level--;
	}

	if (data.nationality) {
		level--;
	}

	if (data.address) {
		level--;
	}

	if (data.idPhotoFile) {
		level--;
	}

	if (data.signatureFile) {
		level--;
	}

	return level;
};

const imagesLevelMap: Record<string, string> = {};

const BACKGROUND_SEED = 45381;
const ID_WIDTH = 712;

const IdCardView: React.ForwardRefRenderFunction<HTMLDivElement, IdCardProps> = (
	{ className, data, displayBlurredData, onWatermarkLoad },
	ref
) => {
	const theme = data.theme || COLOR_OPTIONS[0];
	const level = getBackgroundLevel(data);
	const address = useAddress();
	const tokenAddress = data.idNumber ? `${data.idNumber}${data.documentNumber}${address}` : address;
	const publicViewLink = `${window.origin}/nft-id/rebus/v1/${address}`;

	const [backgroundImage, setBackgroundImage] = useState('');

	useEffect(() => {
		const key = `${theme.name}-${level}`;

		if (imagesLevelMap[key]) {
			setBackgroundImage(imagesLevelMap[key]);
			return;
		}

		const image = (trianglify as any)({
			width: ID_WIDTH,
			height: ID_WIDTH,
			cellSize: 14 * level,
			xColors: theme.colors,
			seed: BACKGROUND_SEED * level,
		})
			.toCanvas()
			.toDataURL();

		setBackgroundImage(image);
	}, [level, theme.colors, theme.name]);

	let nationalityFlagSvg = '';
	try {
		if (data.nationality) {
			nationalityFlagSvg = require(`svg-country-flags/svg/${countriesToAbbvMap[
				data.nationality || ''
			]?.toLowerCase()}.svg`).default;
		}
	} catch (err) {
		console.error(`Flag for country ${data.nationality} not found`);
	}

	return (
		<div
			className={classNames('overflow-hidden relative', className)}
			id="nft-id"
			ref={ref}
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundPosition: 'top center',
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				maxWidth: `${ID_WIDTH}px`,
				minWidth: `${ID_WIDTH}px`,
			}}>
			<div className="absolute w-full flex justify-center">
				<img
					onLoad={onWatermarkLoad}
					src="/public/assets/backgrounds/watermark.svg"
					style={{
						position: 'relative',
						top: '129px',
					}}
				/>
			</div>
			<div className="p-6">
				<div className="flex justify-between">
					<div>
						<div className="flex items-center">
							<img className="w-6 h-6" src="/public/assets/main/rebus-logo-single.svg" />
							<div className="ml-2" style={{ textShadow: '0px 1px rgba(0, 0, 0, 0.6)', whiteSpace: 'nowrap' }}>
								REBUS CHAIN NFT IDENTITY CARD
							</div>
						</div>

						{data.name && (
							<DataItem
								className="mt-6"
								isBlurred={data.nameHidden && !displayBlurredData}
								label="Full Name"
								value={data.name}
							/>
						)}

						<div className="flex mt-6">
							{data.dateOfBirth && (
								<DataItem
									isBlurred={data.dateOfBirthHidden && !displayBlurredData}
									label="Date of Birth"
									value={data.dateOfBirth}
								/>
							)}
							{data.gender && (
								<DataItem
									className={data.dateOfBirth ? 'ml-19' : ''}
									isBlurred={data.genderHidden && !displayBlurredData}
									label="Sex"
									value={data.gender}
								/>
							)}
						</div>

						{(data.cityOfBirth || data.stateOfBirth) && (
							<DataItem
								className="mt-6"
								isBlurred={data.placeOfBirthHidden && !displayBlurredData}
								label="Place of Birth"
								value={`${data.cityOfBirth || ''}${
									data.stateOfBirth && data.cityOfBirth ? `, ${data.stateOfBirth}` : data.stateOfBirth || ''
								}`}
							/>
						)}

						{data.nationality && (
							<div className="flex items-center mt-6">
								<div className="relative flex-shrink-0">
									<img
										className="rounded opacity-90"
										src={nationalityFlagSvg}
										style={{ objectFit: 'contain', objectPosition: 'center', width: '56px' }}
									/>
									{data.nationalityHidden && <NoFlag className="rounded" />}
								</div>
								<DataItem
									className="ml-3"
									isBlurred={data.nationalityHidden && !displayBlurredData}
									label="Nationality"
									value={data.nationality}
								/>
							</div>
						)}
					</div>

					<div className="flex flex-col items-end">
						{data.idPhotoFile?.source && (
							<DataItem isBlurred={data.idPhotoFileHidden && !displayBlurredData}>
								<div
									className="bg-gray-1 rounded-2lg flex-shrink-0"
									style={{
										backgroundImage: `url(${data.idPhotoFile.source})`,
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'cover',
										height: '222px',
										width: '193px',
									}}
								/>
							</DataItem>
						)}

						{data.idNumber && (
							<DataItem
								className={classNames('items-end', data.idPhotoFile?.source && 'mt-6')}
								label="ID Number"
								value={data.idNumber}
							/>
						)}

						{data.signatureFile?.source && (
							<DataItem
								className={classNames('items-end', data.idNumber ? 'mt-2' : 'mt-6')}
								isBlurred={data.signatureFileHidden && !displayBlurredData}
								label="Signature">
								<img
									className="mt-1"
									src={data.signatureFile.source}
									style={{
										filter: 'brightness(0) invert(1)',
										height: '38px',
										maxWidth: '193px',
										objectFit: 'contain',
										objectPosition: 'top',
									}}
								/>
							</DataItem>
						)}
					</div>
				</div>

				{(data.address || data.issuedBy || data.documentNumber) && (
					<div className="flex mt-10">
						{data.address && (
							<DataItem
								className="w-1/2 break-words"
								isBlurred={data.addressHidden && !displayBlurredData}
								label="Permanent Address">
								<div style={{ maxHeight: '84px', overflow: 'hidden' }}>
									{data.address
										?.split(/\r?\n/)
										?.slice(0, 3)
										.map((line, index) => (
											<div key={index}>{line}</div>
										))}
								</div>
							</DataItem>
						)}

						<div>
							{data.issuedBy && <DataItem label="Issued By" value={data.issuedBy} />}
							{data.documentNumber && (
								<DataItem className={data.issuedBy ? 'mt-2' : ''} label="Document Number" value={data.documentNumber} />
							)}
						</div>
					</div>
				)}

				<div className="flex bg-white rounded-br-2lg rounded-bl-2lg p-5 mt-12">
					<QRCode size={100} value={publicViewLink} />
					<div className="ml-5">
						<div className="uppercase text-xl black break-all" style={{ lineHeight: '29px' }}>
							{tokenAddress}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const NoFlag = styled.div`
	background-color: #4f4f4f;
	height: 100%;
	left: 0;
	overflow: hidden;
	position: absolute;
	top: 0;
	width: 100%;

	&:after {
		background: linear-gradient(
			to top left,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0) calc(50% - 0.8px),
			#828282 50%,
			rgba(0, 0, 0, 0) calc(50% + 0.8px),
			rgba(0, 0, 0, 0) 100%
		);
		content: '';
		height: 100%;
		position: absolute;
		width: 100%;
	}
`;

export const IdCard = forwardRef(IdCardView);
