import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

type ValidatorNameProps = {
	index: number;
	name: string;
	value: any;
};

const selector = (state: RootState) => {
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
		<Container>
			{image &&
			image.length &&
			image[0] &&
			image[0].them &&
			image[0].them.length &&
			image[0].them[0] &&
			image[0].them[0].pictures &&
			image[0].them[0].pictures.primary &&
			image[0].them[0].pictures.primary.url ? (
				<Image alt={value.description && value.description.moniker} src={image[0].them[0].pictures.primary.url} />
			) : value.description && value.description.moniker ? (
				<Image as="div" className="image" style={{ background: colors[index % 6] }}>
					{value.description.moniker[0]}
				</Image>
			) : (
				<Image as="div" className="image" style={{ background: colors[index % 6] }} />
			)}
			<p className="heading_text1">{name}</p>
		</Container>
	);
};

const Container = styled.div`
	align-items: center;
	display: flex;
	width: 200px;

	@media (max-width: 958px) {
		width: 100%;
	}
`;

const Image = styled.img`
	background: #ededed;
	color: #ffffff;
	width: 40px;
	height: 40px;
	border-radius: 50px;
	margin-right: 20px;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default ValidatorName;
