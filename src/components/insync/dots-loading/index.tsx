import React, { FunctionComponent } from 'react';
import './index.scss';

const DotsLoading: FunctionComponent = () => {
	return (
		<div className="spinner">
			<div className="bounce1" />
			<div className="bounce2" />
			<div className="bounce3" />
		</div>
	);
};

export default DotsLoading;
