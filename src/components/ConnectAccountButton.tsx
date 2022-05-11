import styled from '@emotion/styled';
import * as React from 'react';
import { Button } from 'src/components/common/button';
import { Text } from 'src/components/Texts';
import useWindowSize from 'src/hooks/useWindowSize';

interface ConnectAccountButtonProps {
	textStyle?: React.CSSProperties;
}

export function ConnectAccountButton(props: React.HTMLAttributes<HTMLButtonElement> & ConnectAccountButtonProps) {
	const { isMobileView } = useWindowSize();

	return (
		<Button {...(props as any)} style={{ whiteSpace: 'nowrap' }}>
			<WalletImg src="/public/assets/Icons/Wallet.svg" />
			<Text
				style={{
					marginLeft: '6px',
					...props.textStyle,
				}}
				isMobileView={isMobileView}
				emphasis="high"
				weight="semiBold">
				Connect Wallet
			</Text>
		</Button>
	);
}

const ConnectAccountButtonWrapper = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 12px 4px;

	@media (min-width: 768px) {
		padding: 14px 4px;
	}
`;

const WalletImg = styled.img`
	width: 1.25rem;
	height: 1.25rem;
`;
