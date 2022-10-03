import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
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
		<IconButton className="fixed top-2.5 left-2.5" onClick={onClick}>
			<img alt="back" src={backIcon} style={{ width: 'unset' }} />
		</IconButton>
	);
};

export default withRouter(BackButton);
