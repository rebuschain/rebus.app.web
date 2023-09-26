import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '../insync/text-field/textField';
import { Button } from './button';
import Checkbox from './checkbox';

interface ModalProps {
	title: string;
	subtitle: string;
	textfields: Array<{
		label: string;
		assistiveText: string;
		disabled: boolean;
		error: boolean;
		errorMessage: string;
	}>;
	checkboxes: Array<{ label: string }>;
	onClose?: () => void;
	onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, subtitle, textfields, checkboxes, onClose, onConfirm }) => {
	const [isVisible, setVisible] = useState(true);

	const closeModal = () => {
		setVisible(false);
		if (onClose) {
			onClose();
		}
	};

	const handleConfirm = () => {
		closeModal();
		if (onConfirm) {
			onConfirm();
		}
	};

	return isVisible ? (
		<ModalBackdrop>
			<ModalContainerStyled>
				<ModalHeader>
					<h4>{title}</h4>
					<Button backgroundStyle={'ghost'} onClick={closeModal}>
						&#10005;
					</Button>
				</ModalHeader>
				{textfields.map((textfield, index) => (
					<TextField
						key={index}
						label={textfield.label}
						assistiveText={textfield.assistiveText}
						disabled={textfield.disabled}
						error={textfield.error}
						errorMessage={textfield.errorMessage}
					/>
				))}
				<ModalSubHeader>
					<h6>{subtitle}</h6>
				</ModalSubHeader>
				{checkboxes.map((checkbox, index) => (
					<Checkbox key={index} label={checkbox.label} style={{ paddingTop: '10px' }} />
				))}
				<ModalFooter>
					<Button backgroundStyle={'ghost'} onClick={closeModal}>
						Cancel
					</Button>
					<Button backgroundStyle={'primary'} onClick={handleConfirm}>
						Save
					</Button>
				</ModalFooter>
			</ModalContainerStyled>
		</ModalBackdrop>
	) : null;
};

const ModalBackdrop = styled.div`
	background-color: rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
	backdrop-filter: blur(5px);
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ModalContainerStyled = styled.div`
	background-color: ${props => props.theme.background};
	color: ${props => props.theme.text};
	border-radius: 8px;
	padding: 24px;
	width: 25%;
`;

const ModalHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 8px;
`;

const ModalSubHeader = styled.div`
	padding-top: 24px;
	margin: 0px;
`;

const ModalFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	padding-top: 8px;
`;

export default Modal;
