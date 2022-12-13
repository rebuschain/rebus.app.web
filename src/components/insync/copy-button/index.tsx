import React, { FunctionComponent } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import copy from 'src/assets/user-details/copy.png';

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
			<IconButtonStyled onClick={handleCopy}>
				<img alt="copy" src={copy} />
			</IconButtonStyled>
		</Tooltip>
	);
};

const IconButtonStyled = styled(IconButton)`
	margin-left: 20px;
	width: 50px;
	height: 50px;
	padding: 0;

	.icon {
		width: 20px;
	}
`;

export default CopyButton;
