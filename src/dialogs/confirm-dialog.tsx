import React from 'react';
import styled from 'styled-components';
import Modal from 'src/components/common/modal';

type Props = {
	content: string;
	isOpen?: boolean;
	onClose?: () => void;
	onConfirm?: () => void;
	title: string;
};

const ConfirmDialog: React.FC<React.PropsWithChildren<Props>> = ({
	content,
	isOpen = false,
	onClose,
	onConfirm,
	title,
}) => {
	return (
		<Modal title={<h4>{title}</h4>} subtitle={<p>{content}</p>} onClose={onClose} onConfirm={onConfirm} open={isOpen} />
	);
};

export default ConfirmDialog;
