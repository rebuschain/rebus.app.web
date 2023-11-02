import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import TextField from '../insync/text-field/text-field';
import { Button } from './button';
import Checkbox from './checkbox';

interface ModalProps {
	title?: ReactNode;
	subtitle?: ReactNode;
	onClose?: () => void;
	onConfirm?: () => void;
	open?: boolean;
	hasCancelButton?: boolean;
	hasExitButton?: boolean;
	hasSubmitButton?: boolean;
	submitText?: string;
	submitButtonDisabled?: boolean;
	children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
	title,
	subtitle,
	onClose,
	onConfirm,
	open = true,
	hasCancelButton = true,
	hasExitButton = true,
	hasSubmitButton = true,
	submitText = 'Save',
	submitButtonDisabled = false,
	children,
}) => {
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
					{hasExitButton && (
						<Button backgroundStyle={'ghost'} onClick={closeModal}>
							&#10005;
						</Button>
					)}
				</ModalHeader>
				<ModalSubHeader>{subtitle}</ModalSubHeader>
				{children}
				<ModalFooter>
					{hasCancelButton && (
						<Button backgroundStyle={'ghost'} onClick={closeModal}>
							Cancel
						</Button>
					)}
					{hasSubmitButton && (
						<Button backgroundStyle={'primary'} onClick={handleConfirm} disabled={submitButtonDisabled}>
							{submitText}
						</Button>
					)}
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

/*
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
				{checkboxes?.map((checkbox, index) => (
					<Checkbox key={index} label={checkbox.label} onChange={checkbox.onChange} style={{ paddingTop: '10px' }} />
				))}
*/
