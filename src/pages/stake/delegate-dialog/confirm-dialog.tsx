import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { ResultDialogHeader, ResultDialogText } from './components';

type Props = {
	content: string;
	isOpen?: boolean;
	onClose?: () => void;
	onConfirm?: () => void;
	title: string;
};

const ConfirmDialog: React.FC<Props> = ({ content, isOpen = false, onClose, onConfirm, title }) => {
	return (
		<Dialog className="dialog" open={isOpen} onClose={onClose}>
			<DialogContent className="content">
				<div className="flex items-center mb-7.5 justify-center">
					<ResultDialogHeader>{title}</ResultDialogHeader>
				</div>
				<ResultDialogText className="text-center">{content}</ResultDialogText>
			</DialogContent>
			<DialogActions className="footer">
				<Button variant="contained" onClick={onClose}>
					No
				</Button>
				<Button variant="contained" onClick={onConfirm}>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
