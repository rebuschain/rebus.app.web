import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import TextField from 'src/components/insync/text-field';
import { ResultDialogHeader, ResultDialogText } from './components';

type Props = {
	content: string;
	isDisabled?: boolean;
	isOpen?: boolean;
	onChange: (value: string) => void;
	onClose?: () => void;
	onSubmit?: () => void;
	submitText: string;
	title: string;
	value?: string;
};

const InputDialog: React.FC<Props> = ({
	content,
	isDisabled = false,
	isOpen = false,
	onChange,
	onClose,
	onSubmit,
	submitText,
	title,
	value = '',
}) => {
	return (
		<Dialog className="dialog" open={isOpen} onClose={onClose}>
			<DialogContent className="content">
				<div className="flex items-center mb-7.5 justify-center">
					<ResultDialogHeader>{title}</ResultDialogHeader>
				</div>
				<ResultDialogText className="text-center">{content}</ResultDialogText>

				<TextField id="input-dialog-input" name="input" value={value} onChange={onChange} />
			</DialogContent>
			<DialogActions className="footer">
				<Button disabled={isDisabled} variant="contained" onClick={onSubmit}>
					{submitText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default InputDialog;
