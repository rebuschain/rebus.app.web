import React, { FunctionComponent } from 'react';
import { CircularProgress as MaterialCircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import ClassNames from 'classnames';

type CircularProgressProps = {
	className?: string;
};

const CircularProgress: FunctionComponent<CircularProgressProps> = props => {
	return (
		<Container className={ClassNames('circular_progress', props.className ? props.className : '')}>
			<MaterialCircularProgress />
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 200px;
	display: flex;
	align-items: center;
	justify-content: center;

	&.full_screen {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: #00000070;
		z-index: 9;
	}

	& > div {
		color: #ffffff;
	}
`;

export default CircularProgress;
