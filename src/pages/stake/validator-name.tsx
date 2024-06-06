import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { useAppSelector } from 'src/hooks/use-app-select';
import { RootState } from 'src/reducers/store';

const colors = ['#0023DA', '#C9387E', '#EC2C00', '#80E3F2', '#E86FC5', '#1F3278', '#FFE761', '#7041B9'];

type ValidatorNameProps = {
	index: number;
	identity?: number;
	moniker: string;
};

const selector = (state: RootState) => {
	return {
		imagesMap: state.stake.validators.imagesMap,
	};
};

const ValidatorName: FunctionComponent<React.PropsWithChildren<ValidatorNameProps>> = ({
	index,
	identity,
	moniker,
}) => {
	const { imagesMap } = useAppSelector(selector);
	const image = identity ? imagesMap?.[identity.toString()] : undefined;

	return (
		<Container>
			{image?.them?.[0]?.pictures?.primary?.url ? (
				<Image alt={moniker} src={image.them[0].pictures.primary.url} />
			) : moniker ? (
				<Image as="div" className="image" style={{ background: colors[index % 6] }}>
					{moniker[0]}
				</Image>
			) : (
				<Image as="div" className="image" style={{ background: colors[index % 6] }} />
			)}
			<p className="heading_text1">{moniker}</p>
		</Container>
	);
};

const Container = styled.div`
	align-items: center;
	display: flex;
	width: 200px;

	.heading_text1 {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

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
