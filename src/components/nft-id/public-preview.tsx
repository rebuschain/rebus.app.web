import React from 'react';
import QRCode from 'qrcode.react';
import { ReactSVG } from 'react-svg';
import { NftIdData } from 'src/types/nft-id';
import { DataItem } from './data-item';
import styled from '@emotion/styled';

type PublicPreviewProps = {
	className?: string;
	data: NftIdData;
};

const getBackgroundImageUrl = (level: number) => `/public/assets/backgrounds/nft-id/bg-${level}.svg`;

const getMiddleAddressLine = (data: NftIdData) => {
	let middleAddressLine = data.city;

	if (middleAddressLine && (data.state || data.zipCode)) {
		middleAddressLine += ', ';
	}

	if (data.state) {
		middleAddressLine += data.state;
	}

	if (data.zipCode) {
		if (data.state) {
			middleAddressLine += ' ';
		}

		middleAddressLine += data.zipCode;
	}

	return middleAddressLine;
};

const getBackgroundLevel = (data: NftIdData) => {
	let level = 8;

	if (data.name) {
		level--;
	}

	if (data.dateOfBirth && data.gender) {
		level--;
	}

	if (data.cityOfBirth && data.stateOfBirth) {
		level--;
	}

	if (data.nationality) {
		level--;
	}

	if (data.address && data.city && data.state && data.zipCode) {
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

export const PublicPreview: React.FC<PublicPreviewProps> = ({ className, data }) => {
	const hasAddress = data.address || data.city || data.country || data.zipCode || data.state;
	const middleAddressLine = getMiddleAddressLine(data);
	const level = getBackgroundLevel(data);

	return (
		<div className={className}>
			<h5 className="mb-6 whitespace-nowrap">Public Preview</h5>

			<div
				className="border-3xl rounded-3xl overflow-hidden relative"
				id="nft-id"
				style={{
					backgroundImage: `url(${getBackgroundImageUrl(level)})`,
					backgroundPosition: 'top center',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					maxWidth: '712px',
					minWidth: '712px',
				}}>
				<div className="absolute w-full flex justify-center">
					<ReactSVG
						src="/public/assets/backgrounds/nft-id/watermark.svg"
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
								<div className="ml-2">REBUS CHAIN NFT IDENTITY CARD</div>
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
									<div
										className="bg-gray-2 flex-shrink-0"
										style={{
											backgroundImage: `url()`,
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
											backgroundSize: 'contain',
											height: '36px',
											width: '56px',
										}}
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
								<DataItem className={data.idNumber ? 'mt-2' : 'mt-6'} label="Signature">
									<div
										className="mt-1"
										style={{
											backgroundImage: `url(${data.signatureFile.source})`,
											backgroundPosition: 'left center',
											backgroundRepeat: 'no-repeat',
											backgroundSize: 'contain',
											height: '38px',
										}}
									/>
								</DataItem>
							)}
						</div>
					</div>

					{(hasAddress || data.issuedBy || data.documentNumber) && (
						<div className="flex mt-10">
							{hasAddress && (
								<DataItem className="w-1/2" label="Permanent Address">
									{data.address}
									{data.address && (middleAddressLine || data.country) && <br />}
									{middleAddressLine}
									{(data.address || middleAddressLine) && data.country && <br />}
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
