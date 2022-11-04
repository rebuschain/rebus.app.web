import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode.react';
import countries from 'svg-country-flags/countries.json';
import { ReactSVG } from 'react-svg';
import { NftIdData, Theme } from 'src/types/nft-id';
import { DataItem } from './data-item';
import styled from '@emotion/styled';
import trianglify from 'trianglify';
import { ColorPicker } from './color-picker';

type PublicPreviewProps = {
	className?: string;
	data: NftIdData;
	onChangeColor: (theme: Theme) => void;
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

	if (data.address && data.country) {
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

const COLOR_OPTIONS = [
	{
		name: 'Blue',
		colors: ['#A8E0FF', '#7BC8FF', '#0295FF', '#0B0084', '#0B0084'],
	},
	{
		name: 'Red',
		colors: ['#ff5454', '#F8A8A8', '#FC4343', '#860020', '#860020'],
	},
	{
		name: 'Pink',
		colors: ['#EE8BF0', '#F24BF5', '#B34BF5', '#96005C', '#411000'],
	},
	{
		name: 'Blue and Pink',
		colors: ['#a7cfba', '#9fe0e0', '#2083DF', '#8A008A', '#33001E'],
	},
	{
		name: 'Green',
		colors: ['#baafa8', '#D4D2AA', '#209159', '#00555A', '#002434'],
	},
	{
		name: 'Black',
		colors: ['#999999', '#555555', '#333333', '#111111', '#000000'],
	},
];

export const PublicPreview: React.FC<PublicPreviewProps> = ({ className, data, onChangeColor }) => {
	const level = getBackgroundLevel(data);

	const [backgroundImage, setBackgroundImage] = useState('');

	const theme = data.theme || COLOR_OPTIONS[0];

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
		nationalityFlagSvg = require(`svg-country-flags/svg/${countriesToAbbvMap[
			data.nationality || ''
		]?.toLowerCase()}.svg`).default;
	} catch (err) {
		console.error(`Flag for country ${data.nationality} not found`);
	}

	return (
		<div className={className}>
			<div className="flex items-center mb-6">
				<h5 className="whitespace-nowrap">Public Preview</h5>
				<ColorPicker className="ml-3" onChange={onChangeColor} options={COLOR_OPTIONS} value={theme} />
			</div>

			<div
				className="border-3xl rounded-3xl overflow-hidden relative"
				id="nft-id"
				style={{
					backgroundImage: `url(${backgroundImage})`,
					backgroundPosition: 'top center',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					maxWidth: `${ID_WIDTH}px`,
					minWidth: `${ID_WIDTH}px`,
				}}>
				<div className="absolute w-full flex justify-center">
					<ReactSVG
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
								<ReactSVGStyled src="/public/assets/main/rebus-logo-single.svg" />
								<div className="ml-2" style={{ textShadow: '0px 1px rgba(0, 0, 0, 0.6)' }}>
									REBUS CHAIN NFT IDENTITY CARD
								</div>
							</div>

							{data.name && (
								<DataItem className="mt-6" isBlurred={data.nameHidden} label="Full Name" value={data.name} />
							)}

							<div className="flex mt-6">
								{data.dateOfBirth && (
									<DataItem isBlurred={data.dateOfBirthHidden} label="Date of Birth" value={data.dateOfBirth} />
								)}
								{data.gender && (
									<DataItem
										className={data.dateOfBirth ? 'ml-19' : ''}
										isBlurred={data.genderHidden}
										label="Sex"
										value={data.gender}
									/>
								)}
							</div>

							{(data.cityOfBirth || data.stateOfBirth) && (
								<DataItem
									className="mt-6"
									isBlurred={data.placeOfBirthHidden}
									label="Place of Birth"
									value={`${data.cityOfBirth || ''}${
										data.stateOfBirth && data.cityOfBirth ? `, ${data.stateOfBirth}` : data.stateOfBirth || ''
									}`}
								/>
							)}

							{data.nationality && (
								<div className="flex items-center mt-6">
									<img
										className="flex-shrink-0 rounded-md opacity-90"
										src={data.nationalityHidden ? '/public/assets/backgrounds/no-flag.svg' : nationalityFlagSvg}
										style={{ height: '36px' }}
									/>
									<DataItem
										className="ml-3"
										isBlurred={data.nationalityHidden}
										label="Nationality"
										value={data.nationality}
									/>
								</div>
							)}
						</div>

						<div>
							{data.idPhotoFile?.source && (
								<DataItem isBlurred={data.idPhotoFileHidden}>
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
								<DataItem className={data.idPhotoFile?.source ? 'mt-6' : ''} label="ID Number" value={data.idNumber} />
							)}

							{data.signatureFile?.source && (
								<DataItem
									className={data.idNumber ? 'mt-2' : 'mt-6'}
									isBlurred={data.signatureFileHidden}
									label="Signature">
									<img
										className="mt-1"
										src={data.signatureFile.source}
										style={{
											filter: 'grayscale(100%)',
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

					{(data.address || data.country || data.issuedBy || data.documentNumber) && (
						<div className="flex mt-10">
							{(data.address || data.country) && (
								<DataItem className="w-1/2 break-words" isBlurred={data.addressHidden} label="Permanent Address">
									<div style={{ maxHeight: '84px', overflow: 'hidden' }}>
										{data.address
											?.split(/\r?\n/)
											?.slice(0, 3)
											.map((line, index) => (
												<div key={index}>{line}</div>
											))}
									</div>
									{data.country}
								</DataItem>
							)}

							<div>
								{data.issuedBy && <DataItem label="Issued By" value={data.issuedBy} />}
								{data.documentNumber && (
									<DataItem
										className={data.issuedBy ? 'mt-2' : ''}
										label="Document Number"
										value={data.documentNumber}
									/>
								)}
							</div>
						</div>
					)}

					<div className="flex bg-white rounded-br-2lg rounded-bl-2lg p-5 mt-12">
						<QRCode size={100} value="0x98ac833e0f00157cb9918833e0f00157c0157cb9918833e0f0015798ac833e0f0c55" />
						<div className="ml-5">
							<div className="uppercase text-xs black" style={{ lineHeight: '14px' }}>
								Token Address
							</div>
							<div className="uppercase text-xl black break-all" style={{ lineHeight: '29px' }}>
								0x98ac833e0f00157cb9918833e0f00157c0157cb9918833e0f0015798ac833e0f0c55
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ReactSVGStyled = styled(ReactSVG as any)`
	svg {
		height: 24px;
		width: 24px;
	}
`;
