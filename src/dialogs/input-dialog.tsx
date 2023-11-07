import React from 'react';
import Modal from 'src/components/common/modal';
import TextField from 'src/components/insync/text-field/text-field';

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
		<Modal
			title={<h4>{title}</h4>}
			subtitle={<p>{content}</p>}
			open={isOpen}
			onClose={onClose}
			hasCancelButton={false}
			hasExitButton={false}
			submitText={submitText}
			onConfirm={onSubmit}
			submitButtonDisabled={isDisabled}>
			<TextField
				label=""
				value={value}
				onChange={e => {
					e.preventDefault();
					onChange(e.currentTarget.value);
				}}
			/>
		</Modal>
	);
};

export default InputDialog;
