import React, { useState } from 'react';
import styled from 'styled-components';
import { wrapBaseDialog } from './base';
import Checkbox from 'src/components/common/checkbox';
import { Button } from 'src/components/common/button';

export const TermsDialog = wrapBaseDialog(
	({
		title,
		children,
		onAgree,
		initialFocus,
	}: {
		title: string;
		children?: React.ReactNode;
		onAgree: () => void;
		initialFocus: React.RefObject<HTMLDivElement>;
	}) => {
		const [isChecked, setIsChecked] = useState(false);

		return (
			<TermsDialogStyled className="max-w-modal">
				<h4 className="mb-6 text-lg md:text-2xl">{title}</h4>
				<TermsDialogChildrenStyled className="rounded-2xl p-5 text-xs md:text-sm mb-6">
					{children}
				</TermsDialogChildrenStyled>
				<div className="flex justify-center items-center mb-6" ref={initialFocus}>
					<Checkbox
						label="I understand the risks and would like to proceed."
						onChange={() => {
							setIsChecked(value => !value);
						}}
					/>
				</div>
				<div className="w-full flex justify-center">
					<Button
						backgroundStyle={'primary'}
						onClick={e => {
							e.preventDefault();
							onAgree();
						}}
						disabled={!isChecked}>
						Proceed
					</Button>
				</div>
			</TermsDialogStyled>
		);
	}
);

const TermsDialogStyled = styled.div`
	background-color: ${props => props.theme.background};
	color: ${props => props.theme.text};
`;

const TermsDialogChildrenStyled = styled.div`
	border: 1px solid ${props => props.theme.gray.dark};
	background-color: ${props => props.theme.gray.lightest};
`;
