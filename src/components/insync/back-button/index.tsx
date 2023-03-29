import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import backIcon from 'src/assets/back.png';

interface BackButtonProps {
	onClick: () => void;
}

const BackButton: FunctionComponent<React.PropsWithChildren<BackButtonProps>> = props => {
	const navigate = useNavigate();
	const onClick = () => {
		if (props.onClick) {
			props.onClick();

			return;
		}

		navigate(-1);
	};

	return (
		<IconButton onClick={onClick} size="large">
			<img alt="back" src={backIcon} style={{ width: 'unset' }} />
		</IconButton>
	);
};

export default BackButton;
