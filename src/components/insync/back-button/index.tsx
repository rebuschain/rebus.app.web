import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import backIcon from 'src/assets/back.png';
import './index.scss';

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
		<IconButton className="back_button" onClick={onClick}>
			<img alt="back" src={backIcon} />
		</IconButton>
	);
};

export default withRouter(BackButton);
