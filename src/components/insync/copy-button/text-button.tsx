import React, { FunctionComponent } from 'react';
import { Button, Tooltip } from '@mui/material';
import './index.scss';

type CopyButtonProps = {
	data: string;
};

const CopyButton: FunctionComponent<React.PropsWithChildren<CopyButtonProps>> = props => {
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
			<Button className="copy_button" variant="outlined" onClick={handleCopy}>
				{props.children}
			</Button>
		</Tooltip>
	);
};

export default CopyButton;
