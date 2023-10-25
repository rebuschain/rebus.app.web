import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import TextField from '../insync/text-field/text-field';
import { Button } from './button';
import Checkbox from './checkbox';

interface ModalProps {
	title: ReactNode;
	subtitle: ReactNode;
	textfields?: Array<{
		label: string;
		value: string;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		assistiveText?: string;
		placeholder?: string;
		disabled?: boolean;
		errorMessage?: string;
		buttonText?: string;
	}>;
	checkboxes?: Array<{ label: string; onChange: () => void }>;
	onClose?: () => void;
	onConfirm?: () => void;
	open?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, subtitle, textfields, checkboxes, onClose, onConfirm, open = true }) => {
	const [isVisible, setVisible] = useState(open);

	const closeModal = () => {
		setVisible(false);
		if (onClose) {
			onClose();
		}
	};

	const handleConfirm = () => {
		if (onConfirm) {
			setVisible(false);
			onConfirm();
		}
	};

	return isVisible ? (
		<ModalBackdrop>
			<ModalContainerStyled>
				<ModalHeader>
					{title}
					<Button backgroundStyle={'ghost'} onClick={closeModal}>
						&#10005;
					</Button>
				</ModalHeader>
				{textfields?.map((textfield, index) => (
					<TextField
						key={index}
						label={textfield.label}
						value={textfield.value}
						onChange={textfield.onChange}
						assistiveText={textfield.assistiveText}
						placeholder={textfield.placeholder}
						disabled={textfield.disabled}
						errorMessage={textfield.errorMessage}
						buttonText={textfield.buttonText}
					/>
				))}
				<ModalSubHeader>{subtitle}</ModalSubHeader>
				{checkboxes?.map((checkbox, index) => (
					<Checkbox key={index} label={checkbox.label} onChange={checkbox.onChange} style={{ paddingTop: '10px' }} />
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
	width: 35%;
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
