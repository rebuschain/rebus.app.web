import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IconButton } from '@mui/material';
import backIcon from 'src/assets/back.png';

interface BackButtonProps extends RouteComponentProps<any> {
	onClick: () => void;
}

const BackButton: FunctionComponent<BackButtonProps> = props => {
	const onClick = () => {
		if (props.onClick) {
			props.onClick();

			return;
		}

		props.history.back();
	};

	return (
		<IconButton onClick={onClick} size="large">
			<img alt="back" src={backIcon} style={{ width: 'unset' }} />
		</IconButton>
	);
};

export default withRouter(BackButton);
