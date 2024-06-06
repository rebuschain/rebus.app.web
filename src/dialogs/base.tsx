import React, { FunctionComponent } from 'react';
import { Dialog } from '@headlessui/react';
import styled from 'styled-components';

export interface BaseDialogProps {
	dialogStyle?: Record<string, string>;
	isOpen: boolean;
	close?: () => void;
	isHideCloseButton?: boolean;
	initialFocus?: React.MutableRefObject<HTMLElement | null>;
}

// https://github.com/tailwindlabs/headlessui/issues/407
// TODO : has issues with FocusTrap -> fork and fix maybe?
export const BaseDialog: FunctionComponent<React.PropsWithChildren<BaseDialogProps>> = ({
	isOpen,
	close = () => {},
	children,
	dialogStyle,
	isHideCloseButton,
	initialFocus,
}) => {
	return (
		<React.Fragment>
			{isOpen ? (
				<Dialog
					as="div"
					className="fixed inset-0 z-100 overflow-y-auto"
					open={isOpen}
					onClose={close}
					initialFocus={initialFocus}>
					<ContentStyled className="p-5 flex items-center justify-center min-h-screen">
						<Dialog.Overlay className="fixed inset-0 z-0" />
						<div
							style={dialogStyle}
							className="relative w-full md:min-w-modal md:max-w-modal px-4 py-5 md:p-8 shadow-elevation-24dp rounded-2xl z-10">
							{children}
							{!isHideCloseButton && (
								<img
									onClick={() => close()}
									className="absolute cursor-pointer top-3 md:top-5 right-3 md:right-5 w-8 md:w-10"
									src="/public/assets/icons/close.svg"
								/>
							)}
						</div>
					</ContentStyled>
				</Dialog>
			) : null}
		</React.Fragment>
	);
};

export function wrapBaseDialog<C extends React.ElementType>(
	element: C
): React.ElementType<BaseDialogProps & React.ComponentProps<C>> {
	// eslint-disable-next-line react/display-name
	return props => {
		return (
			<BaseDialog
				isOpen={props.isOpen}
				dialogStyle={props.dialogStyle}
				close={props.close}
				isHideCloseButton={props.isHideCloseButton}
				initialFocus={props.initialFocus}>
				{props.isOpen ? React.createElement(element, props) : null}
			</BaseDialog>
		);
	};
}

const ContentStyled = styled.div`
	background: ${props => props.theme.background};
	color: ${props => props.theme.text};
`;
