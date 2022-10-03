import React, { FunctionComponent } from 'react';
import { CircularProgress as MaterialCircularProgress } from '@material-ui/core';
import ClassNames from 'classnames';
import './index.scss';

type CircularProgressProps = {
	className?: string;
};

const CircularProgress: FunctionComponent<CircularProgressProps> = props => {
	return (
		<div className={ClassNames('circular_progress', props.className ? props.className : '')}>
			<MaterialCircularProgress />
		</div>
	);
};

export default CircularProgress;
