import React, { FunctionComponent } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import copy from 'src/assets/userDetails/copy.png';
import './index.scss';

type CopyButtonProps = {
	data: string;
};

const CopyButton: FunctionComponent<CopyButtonProps> = props => {
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleCopy: React.MouseEventHandler<HTMLButtonElement> = e => {
		navigator && navigator.clipboard && navigator.clipboard.writeText(props.data);

		e.stopPropagation();
		setOpen(true);
		setTimeout(handleClose, 1000);
	};

	return (
		<Tooltip arrow open={open} title="Copied!">
			<IconButton className="copy_button" component="button" onClick={handleCopy}>
				<img alt="copy" src={copy} />
			</IconButton>
		</Tooltip>
	);
};

export default CopyButton;
