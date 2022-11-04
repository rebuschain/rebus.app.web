import React from 'react';
import countries from 'svg-country-flags/countries.json';
import { Input, InputProps, InputTypes } from 'src/components/common/input';
import { NftIdData } from 'src/types/nft-id';
import { FileInputProps } from '../common/input/file-input';
import { TextInputProps } from '../common/input/text-input';

type IdFormProps = {
	className?: string;
	data: NftIdData;
	onChange?: TextInputProps['onChange'] | FileInputProps['onChange'];
	onVisibilityChange: (name: string, value: boolean) => void;
};

const dateOfBirthStyle = { minWidth: '180px' };

const COUNTRY_OPTIONS = Object.values(countries)
	.sort((a, b) => a.localeCompare(b))
	.map(country => ({ label: country, value: country }));

export const IdForm: React.FC<IdFormProps> = ({ className, data, onChange, onVisibilityChange }) => {
	const inputRows: InputProps[][] = [
		[
			{
				label: 'Full Name',
				name: 'name',
				className: 'mb-6.5',
				onChange,
				onVisibilityChange,
				placeholder: 'Full Name',
				hide: data.nameHidden,
				value: data.name,
			},
		],
		[
			{
				label: 'Date of Birth',
				name: 'dateOfBirth',
				className: 'mb-6.5 mr-2',
				onChange,
				onVisibilityChange,
				type: InputTypes.Date,
				width: 'w-1/3',
				hide: data.dateOfBirthHidden,
				value: data.dateOfBirth,
				style: dateOfBirthStyle,
			},
			{
				label: 'Gender Identity',
				name: 'gender',
				className: 'mb-6.5',
				onChange,
				onVisibilityChange,
				placeholder: 'Gender',
				width: 'w-2/3',
				hide: data.genderHidden,
				value: data.gender,
			},
		],
		[
			{
				label: 'Place of Birth',
				name: 'cityOfBirth',
				className: 'mb-6.5 mr-1',
				onChange,
				onVisibilityChange,
				placeholder: 'City',
				width: 'w-1/2',
				hide: data.placeOfBirthHidden,
				value: data.cityOfBirth,
			},
			{
				name: 'stateOfBirth',
				className: 'mb-6.5',
				onChange,
				onVisibilityChange,
				placeholder: 'State',
				width: 'w-1/2',
				value: data.stateOfBirth,
			},
		],
		[
			{
				label: 'Nationality',
				name: 'nationality',
				className: 'mb-6.5',
				onChange,
				onVisibilityChange,
				placeholder: 'Nationality',
				hide: data.nationalityHidden,
				value: data.nationality,
				options: COUNTRY_OPTIONS,
				type: InputTypes.Select,
			},
		],
		[
			{
				label: 'Permanent Address',
				name: 'address',
				className: 'mb-1',
				onChange,
				onVisibilityChange,
				placeholder: 'Street Address',
				hide: data.addressHidden,
				value: data.address,
			},
		],
		[
			{
				name: 'city',
				className: 'mb-1 mr-1',
				onChange,
				onVisibilityChange,
				placeholder: 'City',
				width: 'w-7/12',
				value: data.city,
			},
			{
				name: 'state',
				className: 'mb-1 mr-1',
				onChange,
				onVisibilityChange,
				placeholder: 'State',
				width: 'w-2/12',
				value: data.state,
			},
			{
				name: 'zipCode',
				className: 'mb-1',
				onChange,
				onVisibilityChange,
				placeholder: 'Zip Code',
				width: 'w-3/12',
				value: data.zipCode,
			},
		],
		[
			{
				name: 'country',
				className: 'mb-6.5',
				onChange,
				onVisibilityChange,
				placeholder: 'Country',
				value: data.country,
				options: COUNTRY_OPTIONS,
				type: InputTypes.Select,
			},
		],
		[
			{
				label: 'Id Photo',
				name: 'idPhotoFile',
				className: 'mb-6.5',
				onChange,
				onVisibilityChange,
				type: InputTypes.File,
				placeholder: 'Upload File',
				hide: data.idPhotoFileHidden,
				value: data.idPhotoFile,
			},
		],
		[
			{
				label: 'Signature',
				name: 'signatureFile',
				onChange,
				onVisibilityChange,
				type: InputTypes.File,
				placeholder: 'Upload File',
				backgroundSize: 'contain',
				hide: data.signatureFileHidden,
				value: data.signatureFile,
			},
		],
	];

	return (
		<div className={className} style={{ maxWidth: '580px' }}>
			<h5 className="mb-6 whitespace-nowrap">Identification Details</h5>
			<div>
				{inputRows.map((inputs, index) => (
					<div className="flex items-end" key={index}>
						{inputs.map(input => (
							<Input key={input.name} {...input} />
						))}
					</div>
				))}
			</div>
		</div>
	);
};
