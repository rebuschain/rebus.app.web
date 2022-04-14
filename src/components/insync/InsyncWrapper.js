import React, { useEffect } from 'react';
import SnackbarMessage from './SnackbarMessage';

const InsyncWrapper = ({ children }) => {
	useEffect(() => {
		document.body.classList.add('insync');
		return () => document.body.classList.remove('insync');
	}, []);

	return (
		<div className="of_community">
			{children}
			<SnackbarMessage />
		</div>
	);
};

export default InsyncWrapper;
