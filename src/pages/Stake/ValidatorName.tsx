import React, { FunctionComponent } from 'react';
import { useAppSelector } from 'src/hooks/useAppSelect';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

type ValidatorNameProps = {
	index: number;
	name: string;
	value: any;
};

const selector = (state: any) => {
	return {
		validatorImages: state.stake.validators.images,
	};
};

const ValidatorName: FunctionComponent<ValidatorNameProps> = ({ index, name, value }) => {
	const { validatorImages } = useAppSelector(selector);

	const image =
		value &&
		value.description &&
		value.description.identity &&
		validatorImages &&
		validatorImages.length &&
		validatorImages.filter((img: any) => img._id === value.description.identity.toString());

	return (
		<div className="validator">
			{image &&
			image.length &&
			image[0] &&
			image[0].them &&
			image[0].them.length &&
			image[0].them[0] &&
			image[0].them[0].pictures &&
			image[0].them[0].pictures.primary &&
			image[0].them[0].pictures.primary.url ? (
				<img
					alt={value.description && value.description.moniker}
					className="image"
					src={image[0].them[0].pictures.primary.url}
				/>
			) : value.description && value.description.moniker ? (
				<div className="image" style={{ background: colors[index % 6] }}>
					{value.description.moniker[0]}
				</div>
			) : (
				<div className="image" style={{ background: colors[index % 6] }} />
			)}
			<p className="heading_text1">{name}</p>
		</div>
	);
};

export default ValidatorName;
